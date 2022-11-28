const mongoose = require('mongoose');
const { Schema } = mongoose;

// Usuarios Schema (estructura de documentos)
const usuario = Schema({
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
});

// Modelo (coleccion)
const Usuario = mongoose.model('UsuariosClientes', usuario);

module.exports = { Usuario };