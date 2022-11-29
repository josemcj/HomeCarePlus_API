const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const puerto = process.env.PORT || 3000;
const app = express();

app.use( express.urlencoded({ extended: false }) );
app.use( express.json() );

// Obtener configuracion
dotenv.config({ path: './config/config.env' });

connectDB();

// Rutas
app.use('/api', require('./routes/index'));

app.listen(puerto, () => console.log(`Servidor corriendo en el puerto ${puerto}`));

console.log('hola que tal')