const express = require('express');
const app = express();
const usuariosRuta = require('./usuariosRuta');
const serviciosRuta = require('./serviciosRuta');
const pedidosRuta = require('./pedidosRuta');

app.use('/', usuariosRuta);
app.use('/', serviciosRuta);
app.use('/', pedidosRuta);

module.exports = app;