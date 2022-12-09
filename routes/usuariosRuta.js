const express = require('express');
const router = express.Router();
const usuariosControl = require('../controller/usuariosControl');
const uploadImage = require('../middleware/multer');

router.post('/registrar-usuario', usuariosControl.addUsuario);
router.post('/login', usuariosControl.login);

// Obtener todos los usuarios
router.get('/usuarios', usuariosControl.getUsuarios);

// Obtener usuario por su ID
router.get('/usuario/:idUsuario', usuariosControl.getUsuario);

// Editar usuario (excepto email y contraseña)
router.patch('/usuario/:idUsuario/editar', uploadImage, usuariosControl.updateUsuario);

// Eliminar usuario por su ID
router.delete('/usuario/:idUsuario/eliminar', usuariosControl.deleteUsuario);

/**
 * SUBIR IMAGENES (PRUEBA)
 */

// router.post('/upload', uploadImage, usuariosControl.imagen);

module.exports = router;