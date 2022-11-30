const express = require('express');
const router = express.Router();
const serviciosControl = require('../controller/serviciosControl');

// Registrar servicio
router.post('/registrar/servicio/:idPrestador', serviciosControl.addServicio);

// Listar todos los servicios existentes
router.get('/servicios', serviciosControl.getServicios);

// Obtener un servicio
router.get('/servicio/:id', serviciosControl.getServicio);

// Listar servicios de un prestador (para seccion "Mis servicios")
router.get('/prestador/:idPrestador/servicios', serviciosControl.getServiciosDePrestador)

module.exports = router;