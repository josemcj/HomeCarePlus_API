const UsuariosModelo = require('./usuarios');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const prestadorSchema = new Schema({
    profesion: {
        type: String,
        required: true
    },
    serviciosPublicados: [
        {
            type: Schema.ObjectId,
            ref: 'Servicios'
        }
    ]
});

const PrestadorModelo = UsuariosModelo.discriminator('2', prestadorSchema);

module.exports = PrestadorModelo;