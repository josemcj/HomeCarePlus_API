const express = require('express');
const router = express.Router();
const usuariosControl = require('../controller/usuariosControl');

router.post('/registrar/usuario', usuariosControl.addUsuario);

module.exports = router;