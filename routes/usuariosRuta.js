const express = require('express');
const router = express.Router();
const usuariosControl = require('../controller/usuariosControl');

router.post('/registrar-usuario', usuariosControl.addUsuario);
router.post('/login', usuariosControl.login);

// Obtener todos los usuarios
router.get('/usuarios', usuariosControl.getUsuarios);

// Obtener usuario por su ID
router.get('/usuario/:idUsuario', usuariosControl.getUsuario);

module.exports = router;