const express = require('express');
const app = express();
const usuariosRuta = require('../routes/usuariosRuta');
const serviciosRuta = require('../routes/serviciosRuta');

app.use('/', usuariosRuta);
app.use('/', serviciosRuta);

module.exports = app;