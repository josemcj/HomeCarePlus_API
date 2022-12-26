const express = require('express');
const router = express.Router();
const pedidosControl = require('../controller/pedidosControl');

// Realizar un pedido
router.post('/cliente/:idCliente/solicitar/:idServicio', pedidosControl.addPedido);

// Obtener todos los pedidos (solo dev)
router.get('/pedidos', pedidosControl.getPedidos);

// Obtener un pedido
router.get('/pedido/:idPedido', pedidosControl.getPedido);

// Servicios contratados (Cliente, Recycler View)
router.get('/cliente/:idCliente/pedidos', pedidosControl.getPedidosCliente);

// Servicios prestados (Prestador, Recycler View)
router.get('/prestador/:idPrestador/pedidos', pedidosControl.getPedidosPrestador);

// Actualizar estado del pedido
router.patch('/pedido/:idPedido/editar', pedidosControl.updateEstadoPedido);

// Actualizar la fecha del pedido
router.patch('/pedido/:idPedido/editar/fecha', pedidosControl.updateFechaPedido);

module.exports = router;