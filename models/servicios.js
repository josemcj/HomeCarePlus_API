const mongoose = require('mongoose');
const { Schema } = mongoose;

const servicioSchema = new Schema({
    titulo: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true,
        default: 'default_service.jpg'
    },
    precio: {
        type: Number,
        required: true
    },
    prestadorDeServicio: {
        type: Schema.ObjectId,
        ref: 'UsuariosModelo'
    }
});

const ServiciosModelo = mongoose.model('Servicios', servicioSchema);

module.exports = { ServiciosModelo };