const express = require('express');
const router = express.Router();
const usuariosClientesControl = require('../controller/usuariosClientesControl');

// Obtener todos los usuarios (cliente)
router.get('/usuarios/clientes', usuariosClientesControl.getClientes);

// Obtener un solo usuario (cliente)
router.get('/usuarios/cliente/:id', usuariosClientesControl.getCliente);

// Guardar usuario (cliente)
router.post('/usuarios/registrar/cliente', usuariosClientesControl.addCliente);

// Actualizar usuario (cliente)
router.put('/usuarios/cliente/editar/:id', usuariosClientesControl.updateCliente);

// Eliminar usuario (cliente)
router.delete('/usuarios/cliente/eliminar/:id', usuariosClientesControl.deleteCliente);

// Login
router.post('/clientes/login', usuariosClientesControl.loginClientes);

module.exports = router;