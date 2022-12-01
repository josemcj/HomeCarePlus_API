const mongoose = require('mongoose');
const { Schema } = mongoose;

// Prestadores de servicio Schema (estructura de documentos)
const prestadorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    tipoUsuario: {
        type: Number,
        required: true
    },
    profesion: {
        type: String,
        required: true
    },
    direccion: {
        calle: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            required: false
        },
        cp: {
            type: String,
            required: true
        },
        colonia: {
            type: String,
            required: true
        },
        municipio: {
            type: String,
            required: true
        },
        estado: {
            type: String,
            required: true
        }
    },
    servicios: {
        type: Schema.ObjectId,
        ref: 'ServiciosModelo'
    }
});

// Modelo (coleccion)
const PrestadorDeServicios = mongoose.model('PrestadoresDeServicios', prestadorSchema);

module.exports = { PrestadorDeServicios };