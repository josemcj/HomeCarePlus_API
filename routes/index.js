const express = require('express');
const app = express();
const usuarioPrestadorRuta = require('../routes/usuarioPrestadorRuta');
const usuarioClienteRuta = require('../routes/usuarioClienteRuta');

app.use('/', usuarioPrestadorRuta);
app.use('/', usuarioClienteRuta);

module.exports = app;