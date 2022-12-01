const mongoose = require('mongoose');
const { Schema } = mongoose;

const usuarioSchema = new Schema({
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
    profesion: String,
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
    serviciosPublicados: [
        {
            type: Schema.ObjectId,
            ref: 'Servicios'
        }
    ],   
    serviciosContratados: [
        {
            type: Schema.ObjectId,
            ref: 'Servicios'
        }
    ]
});

const UsuariosModelo = mongoose.model('Usuarios', usuarioSchema);

module.exports = { UsuariosModelo }