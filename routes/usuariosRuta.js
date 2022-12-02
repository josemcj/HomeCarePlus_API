const express = require('express');
const router = express.Router();
const usuariosControl = require('../controller/usuariosControl');

router.post('/registrar-usuario', usuariosControl.addUsuario);

// Obtener todos los usuarios
router.get('/usuarios', usuariosControl.getUsuarios);

module.exports = router;