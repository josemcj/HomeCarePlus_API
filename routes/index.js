const express = require('express');
const app = express();
const usuarioPrestadorRuta = require('../routes/usuarioPrestadorRuta');
const usuarioClienteRuta = require('../routes/usuarioClienteRuta');
const serviciosRuta = require('../routes/serviciosRuta');

// Pendiente
const usuariosRuta = require('../routes/usuariosRuta');
app.use('/', usuariosRuta);

app.use('/', usuarioPrestadorRuta);
app.use('/', usuarioClienteRuta);
app.use('/', serviciosRuta);

module.exports = app;