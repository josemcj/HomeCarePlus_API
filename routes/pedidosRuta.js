const express = require('express');
const router = express.Router();
const pedidosControl = require('../controller/pedidosControl');

// Realizar un pedido
router.post('/cliente/:idCliente/solicitar/:idServicio', pedidosControl.addPedido);

// Obtener todos los pedidos (solo dev)
router.get('/pedidos', pedidosControl.getPedidos);

// Obtener un pedido
router.get('/pedido/:idPedido', pedidosControl.getPedido);

// Servicios contratados (cliente, Recycler View)
router.get('/cliente/:idCliente/pedidos', pedidosControl.getPedidosCliente);

module.exports = router;