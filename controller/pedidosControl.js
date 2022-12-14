const { ServiciosModelo } = require('../models/servicios');
const UsuariosModelo = require('../models/usuarios');
const PedidosModelo = require('../models/pedidos');

/**
 * Estado de los servicios
 * Solicitado: El cliente solicita el servicio
 * Aceptado: El prestador de servicio acepto dar el servicio
 * Cancelado: Cancelado por el cliente
 * Rechazado: Rechazado por el prestador de servicios
 * En proceso: El servicio se esta proporcionando en este momento
 * Finalizado: El servicio fue finalizado y pagado
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
    // Recibe la fecha como String: YYYY/MM/DD HH:MM:SS
    const fechaServicio = new Date(req.body.fechaServicio);
    // const fechaPedido = new Date();
    const estado = estadoServicio.solicitado;

    const pedido = new PedidosModelo({
        servicio: servicio,
        cliente: cliente,
        fechaServicio: fechaServicio,
        estado: estado
        // fechaPedido: fechaPedido,
    });

    console.log('fecha: ', new Date())

    console.log(pedido)


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
}

module.exports = {
    addPedido
}