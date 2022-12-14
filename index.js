const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const puerto = process.env.PORT || 3000;
const app = express();

app.use('/static', express.static(`${__dirname}/uploads`));

app.use( express.json({ limit: '20mb' }) );
app.use( express.urlencoded({ extended: false, limit: '20mb'}));

// Obtener configuracion
dotenv.config({ path: './config/config.env' });

connectDB();

// Rutas
app.use('/api', require('./routes/index'));

app.listen(puerto, () => console.log(`Servidor corriendo en el puerto ${puerto}`));