const mongoose = require('mongoose');
const { Schema } = mongoose;
const opciones = { discriminatorKey: 'tipoUsuario', collection: 'usuarios' };

const usuarioBase = new Schema({
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
    }
}, opciones);

const UsuariosModelo = mongoose.model('UsuariosModelo', usuarioBase);

module.exports = UsuariosModelo