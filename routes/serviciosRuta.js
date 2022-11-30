const express = require('express');
const router = express.Router();
const serviciosControl = require('../controller/serviciosControl');

// Registrar servicio
router.post('/registrar/servicio/:idPrestador', serviciosControl.addServicio);

module.exports = router;