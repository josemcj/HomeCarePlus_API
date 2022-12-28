const express = require('express');
const router = express.Router();
const serviciosControl = require('../controller/serviciosControl');
// const uploadImageService = require('../middleware/multerServicios');

// Registrar servicio
router.post('/prestador/:idPrestador/registrar-servicio', serviciosControl.addServicio);

// Listar servicios de un prestador (para seccion "Mis servicios")
router.get('/prestador/:idPrestador/servicios', serviciosControl.getServiciosDePrestador)

// Listar todos los servicios existentes
router.get('/servicios', serviciosControl.getServicios);

// Obtener un servicio
router.get('/servicio/:id', serviciosControl.getServicio);

// Actualizar servicio
router.patch('/servicio/:idServicio/editar', serviciosControl.updateServicio);

// Eliminar servicio
router.delete('/prestador/:idPrestador/servicio/:idServicio/eliminar', serviciosControl.deleteServicio);

/**
 * Buscar servicios por categoria
 */
router.get('/buscar', serviciosControl.searchServicios);

module.exports = router;