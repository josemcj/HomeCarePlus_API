const { ServiciosModelo } = require('../models/servicios');
const UsuariosModelo = require('../models/usuarios');
const PedidosModelo = require('../models/pedidos');
const formatearFecha = require('../helpers/formatearFecha');
const stripe = require('stripe')(process.env.STRIPE_SK);

/**
 * Almacena los diferentes estados que los servicios pueden tener
 * 
 * @typedef {object} estadoServicio
 * 
 * @property {string} estadoServicio.solicitado El cliente ha solicitado el servicio
 * @property {string} estadoServicio.aceptado El prestador acepto dar el servicio
 * @property {string} estadoServicio.cancelado Servicio cancelado por el cliente
 * @property {string} estadoServicio.rechazado Rechazado por el prestador de servicios
 * @property {string} estadoServicio.enProceso El servicio esta siendo proporcionado en este momento
 * @property {string} estadoServicio.finalizado El servicio ha sido completado
 */
const estadoServicio = {
    solicitado: 'Solicitado',
    aceptado: 'Aceptado',
    cancelado: 'Cancelado',
    rechazado: 'Rechazado',
    enProceso: 'En proceso',
    finalizado: 'Finalizado'
}

const createPayment = async (req, res) => {
    // Obtener los datos
    const servicio = await ServiciosModelo.findById(req.params.idServicio).exec();
    const cliente = await UsuariosModelo.findById(req.params.idCliente).exec();
    const precio = servicio.precio * 100;

    const customer = await stripe.customers.create({
        name: cliente.nombre,
        address: {
            line1: `${cliente.direccion.calle} #${cliente.direccion.numero}`,
            postal_code: cliente.direccion.cp,
            city: cliente.direccion.municipio,
            state: cliente.direccion.estado,
            country: 'MX'
        }
    });
    const ephemeralKey = await stripe.ephemeralKeys.create(
        { customer: customer.id },
        { apiVersion: '2022-11-15' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
        amount: precio,
        currency: 'mxn',
        description: `Home Care Plus - ${servicio.titulo}`,
        customer: customer.id,
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).json({
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer.id,
        publishableKey: process.env.STRIPE_PK
    });
}

const addPedido = async (req, res) => {

    const cliente = await UsuariosModelo.findById(req.params.idCliente);
    const servicio = await ServiciosModelo.findById(req.params.idServicio);
    const prestador = await UsuariosModelo.findOne({ _id: servicio.prestadorDeServicio });

    // Recibe la fecha como String: YYYY/MM/DD HH:MM:SS
    const fechaServicio = new Date(req.body.fechaServicio);

    const pedido = new PedidosModelo({
        servicio: servicio,
        cliente: cliente,
        fechaServicio: fechaServicio,
        estado: estadoServicio.solicitado
    });

    await pedido.save()
        .then(pedidoGuardado => {
            res.status(200).json({
                code: 200,
                message: 'Pedido realizado correctamente',
                pedido: pedidoGuardado
            });
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error',
                error: err
            })
        });
    
    // Asignar pedido al array serviciosContratados
    cliente.serviciosContratados.push(pedido);
    await cliente.save();

    // Asignar pedido al array serviciosPrestados
    prestador.serviciosPrestados.push(pedido);
    await prestador.save();
}

// Informacion completa del pedido
const getPedido = async (req, res) => {
    const pedido = await PedidosModelo.findById(req.params.idPedido)
        .populate('servicio')
        .populate('cliente');
    const prestador = await UsuariosModelo.findOne({ _id: pedido.servicio.prestadorDeServicio });

    if (pedido) {
        res.status(200).json({
            code: 200,
            pedido: {
                _id: pedido._id,
                servicio: pedido.servicio,
                cliente: {
                    _id: pedido.cliente._id,
                    nombre: pedido.cliente.nombre,
                    email: pedido.cliente.email,
                    telefono: pedido.cliente.telefono,
                    sexo: pedido.cliente.sexo,
                    imagen: pedido.cliente.imagen,
                    direccion: pedido.cliente.direccion
                },
                prestador: {
                    _id: prestador._id,
                    nombre: prestador.nombre,
                    email: prestador.email,
                    telefono: prestador.telefono,
                    profesion: prestador.profesion,
                    sexo: prestador.sexo,
                    imagen: prestador.imagen
                },
                fechaServicio: formatearFecha( pedido.fechaServicio ),
                fechaPedido: formatearFecha( pedido.fechaPedido ),
                estado: pedido.estado
            },
        });
    } else {
        res.status(404).json({
            code: 404,
            message: 'Pedido no encontrado'
        });
    }
}

const getPedidos = async (req, res) => {
    await PedidosModelo.find({})
        .then(pedidos => {

            if (pedidos.length) {
                res.status(200).json({
                    code: 200,
                    pedidos: pedidos
                });
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'Aún no hay pedidos'
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error'
            });
        })
}

// Lista de servicios contratados (Cliente, Recycler View)
const getPedidosCliente = async (req, res) => {
    const pedidosCliente = await PedidosModelo.find({ cliente: req.params.idCliente })
        .populate({
            path: 'servicio',
            populate: { path: 'prestadorDeServicio' }
        })
    
    if (pedidosCliente.length) {
        
        const serviciosContratados = pedidosCliente.map(pedido => {
            let servicioContratado = {};

            servicioContratado._id = pedido._id;
            servicioContratado.servicio = {
                _id: pedido.servicio._id,
                titulo: pedido.servicio.titulo,
                descripcion: pedido.servicio.descripcion,
                precio: pedido.servicio.precio,
                imagen: pedido.servicio.imagen,
                prestadorDeServicio: {
                    _id: pedido.servicio.prestadorDeServicio._id,
                    nombre: pedido.servicio.prestadorDeServicio.nombre,
                    profesion: pedido.servicio.prestadorDeServicio.profesion,
                    imagen: pedido.servicio.prestadorDeServicio.imagen
                }
            }
            servicioContratado.fechaServicio = formatearFecha( pedido.fechaServicio );
            servicioContratado.fechaPedido = formatearFecha( pedido.fechaPedido );
            servicioContratado.estado = pedido.estado;

            return servicioContratado;
        });

        res.status(200).json({
            code: 200,
            servicios_contratados: serviciosContratados
        })

    } else {
        res.status(404).json({
            code: 404,
            message: 'Aún no has contratado ningún servicio'
        });
    }
}

// Lista de servicios prestados (Prestador, Recycler View)
const getPedidosPrestador = async (req, res) => {
    const pedidosPrestador = await PedidosModelo.find()
        .populate({
            path: 'servicio',
            match: { 'servicio.prestadorDeServicio': req.params.idPrestador }
        })
        .populate('cliente')
        .exec();

    if (pedidosPrestador.length) {

        const serviciosPrestados = pedidosPrestador.map(pedido => {
            let servicioPrestado = {};
            let direccionCliente = `${pedido.cliente.direccion.calle} #${pedido.cliente.direccion.numero}, ${pedido.cliente.direccion.municipio}`;

            servicioPrestado._id = pedido._id;
            servicioPrestado.servicio = pedido.servicio;
            servicioPrestado.cliente = {
                _id: pedido.cliente._id,
                nombre: pedido.cliente.nombre,
                direccion: direccionCliente,
                imagen: pedido.cliente.imagen
            };
            servicioPrestado.fechaServicio = formatearFecha( pedido.fechaServicio );
            servicioPrestado.fechaPedido = formatearFecha( pedido.fechaPedido );
            servicioPrestado.estado = pedido.estado;

            return servicioPrestado;
        });

        res.status(200).json({
            code: 200,
            servicios_prestados: serviciosPrestados
        })

    } else {
        res.status(404).json({
            code: 404,
            message: 'Aún no tienes servicios vendidos'
        });
    }
}

// Actualizar pedido (estado del pedido)
const updateEstadoPedido = async (req, res) => {
    const { estado } = await PedidosModelo.findById(req.params.idPedido).exec();
    let pedidoDatosActualizar = {};

    if (estado != estadoServicio.finalizado && estado != estadoServicio.rechazado && estado != estadoServicio.cancelado) {

        /**
         * Valores para Estado
         * 
         * @typedef {object} req.body
         * @property {string} req.body.estado Estados: 'cancelado', 'rechazado', 'en_proceso', 'finalizado'
         */
        switch( req.body.estado ) {
            case 'en_proceso':
                pedidoDatosActualizar.estado = estadoServicio.enProceso;
                break;
            
            case 'finalizado':
                pedidoDatosActualizar.estado = estadoServicio.finalizado;
                break;

            case 'cancelado':
                pedidoDatosActualizar.estado = estadoServicio.cancelado;
                break;

            case 'rechazado':
                pedidoDatosActualizar.estado = estadoServicio.rechazado;
                break;
            
            default:
                res.status(400).json({
                    code: 400,
                    message: 'Acción no permitida'
                });
                break;
        }

        // Actualizar estado
        await PedidosModelo.findOneAndUpdate({ _id: req.params.idPedido }, pedidoDatosActualizar, { new: true })
            .then(pedido => {
                res.status(200).json({
                    code: 200,
                    message: 'Estado actualizado correctamente',
                    pedido: pedido
                });
            })
            .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) );

    } else {
        res.status(400).json({
            code: 400,
            message: 'Acción no permitida'
        });
    }
}

const updateFechaPedido = async (req, res) => {
    const { estado } = await PedidosModelo.findById(req.params.idPedido).exec();
    // Recibe la fecha como String: YYYY/MM/DD HH:MM:SS
    const fechaServicio = new Date(req.body.fechaServicio);

    const pedidoDatosActualizar = {
        fechaServicio: fechaServicio
    };

    if (estado != estadoServicio.finalizado && estado != estadoServicio.rechazado && estado != estadoServicio.cancelado) {

        await PedidosModelo.findOneAndUpdate({ _id: req.params.idPedido }, pedidoDatosActualizar, { new: true })
            .then(pedido => {
                res.status(200).json({
                    code: 200,
                    message: 'Fecha actualizada correctamente',
                    pedido: pedido
                });
            })
            .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) );

    } else {
        res.status(400).json({
            code: 400,
            message: 'Acción no permitida'
        });
    }
}

module.exports = {
    createPayment,
    addPedido,
    getPedidos,
    getPedido,
    getPedidosCliente,
    getPedidosPrestador,
    updateEstadoPedido,
    updateFechaPedido
}