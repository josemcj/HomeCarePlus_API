const mongoose = require('mongoose');
const { Schema } = mongoose;

const servicioSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    precio: {
        type: Double,
        required: true
    },
    prestadorDeServicio: {
        type: Schema.ObjectId,
        ref: 'PrestadoresDeServicios'
    }
});

const Servicios = mongoose.model('Servicios', servicioSchema);

module.exports = { Servicios };