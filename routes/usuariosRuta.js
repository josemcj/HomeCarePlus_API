const express = require('express');
const router = express.Router();
const usuariosControl = require('../controller/usuariosControl');
// const uploadImageUser = require('../middleware/multerUsuarios');

router.post('/registrar-usuario', usuariosControl.addUsuario);
router.post('/login', usuariosControl.login);

// Obtener todos los usuarios
router.get('/usuarios', usuariosControl.getUsuarios);

// Obtener usuario por su ID
router.get('/usuario/:idUsuario', usuariosControl.getUsuario);

// Editar usuario (excepto email y contraseña)
// router.patch('/usuario/:idUsuario/editar', uploadImageUser, usuariosControl.updateUsuario); -> Subida con Multer
router.patch('/usuario/:idUsuario/editar', usuariosControl.updateUsuario);

// Eliminar usuario por su ID
router.delete('/usuario/:idUsuario/eliminar', usuariosControl.deleteUsuario);

module.exports = router;