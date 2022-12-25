const { ServiciosModelo } = require('../models/servicios');
const UsuariosModelo = require('../models/usuarios');
const PedidosModelo = require('../models/pedidos');
const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

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

    // Fecha en que se realizara el servicio
    const fechaServicio = pedido.fechaServicio.toString().split(' ');
    const mesServicio = meses[ pedido.fechaServicio.getMonth() ];
    const horaServicio = fechaServicio[4].split(':');
    const fechaServicioFinal = `${fechaServicio[2]} ${mesServicio.slice(0, 3)} ${fechaServicio[3]}, ${horaServicio[0]}:${horaServicio[1]} hrs`;

    // Fecha en que se realizo el pedido
    const fechaPedido = pedido.fechaPedido.toString().split(' ');
    const mesPedido = meses[ pedido.fechaPedido.getMonth() ];
    const horaPedido = fechaPedido[4].split(':');
    const fechaPedidoFinal = `${fechaPedido[2]} ${mesPedido.slice(0, 3)} ${fechaPedido[3]}, ${horaPedido[0]}:${horaPedido[1]} hrs`;

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
                fechaServicio: fechaServicioFinal,
                estado: pedido.estado,
                fechaPedido: fechaPedidoFinal
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

// Lista de pedidos contratados (cliente, Recycler View)
const getPedidosCliente = async (req, res) => {
    const pedidosCliente = await PedidosModelo.find({ cliente: req.params.idCliente }).populate('servicio');

    if (pedidosCliente.length) {
        let serviciosContratados = [];

        await Promise.all( pedidosCliente.map(async pedido => {

            // Fecha en que se realizara el servicio
            const fechaServicio = pedido.fechaServicio.toString().split(' ');
            const mesServicio = meses[ pedido.fechaServicio.getMonth() ];
            const horaServicio = fechaServicio[4].split(':');
            const fechaServicioFinal = `${fechaServicio[2]} ${mesServicio.slice(0, 3)} ${fechaServicio[3]}, ${horaServicio[0]}:${horaServicio[1]} hrs`;

            // Fecha en que se realizo el pedido
            const fechaPedido = pedido.fechaPedido.toString().split(' ');
            const mesPedido = meses[ pedido.fechaPedido.getMonth() ];
            const horaPedido = fechaPedido[4].split(':');
            const fechaPedidoFinal = `${fechaPedido[2]} ${mesPedido.slice(0, 3)} ${fechaPedido[3]}, ${horaPedido[0]}:${horaPedido[1]} hrs`;

            serviciosContratados.push({
                _id: pedido._id,
                servicio: await pedido.servicio.populate('prestadorDeServicio'),
                fechaServicio: fechaServicioFinal,
                fechaPedido: fechaPedidoFinal,
                estado: pedido.estado
            });
        }) );

        res.status(200).json({
            code: 200,
            serviciosContratados: serviciosContratados
        });
    } else {
        res.status(404).json({
            code: 404,
            message: 'Aún no has contratado ningún servicio'
        });
    }
}

module.exports = {
    addPedido,
    getPedidos,
    getPedido,
    getPedidosCliente
}