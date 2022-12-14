const express = require('express');
const router = express.Router();
const pedidosControl = require('../controller/pedidosControl');

router.post('/cliente/:idCliente/solicitar/:idServicio', pedidosControl.addPedido);

module.exports = router;