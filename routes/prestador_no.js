const express = require('express');
const router = express.Router();
const usuariosPrestadoresControl = require('../controller/usuariosPrestadoresControl');

// Obtener todos los prestadores
router.get('/usuarios/prestadores', usuariosPrestadoresControl.getPrestadores);

// Obtener prestador por ID
router.get('/usuarios/prestador/:id', usuariosPrestadoresControl.getPrestador);

// Registrar prestador
router.post('/usuarios/registrar/prestador', usuariosPrestadoresControl.addPrestador);

// Actualizar prestador por ID
router.put('/usuarios/prestador/editar/:id', usuariosPrestadoresControl.updatePrestador);

// Borrar prestador
router.delete('/usuarios/prestador/eliminar/:id', usuariosPrestadoresControl.deletePrestador);

// Login
router.post('/prestadores/login', usuariosPrestadoresControl.loginPrestadores);

module.exports = router;