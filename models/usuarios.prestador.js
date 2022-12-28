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
    ],
    serviciosPrestados: [
        {
            type: Schema.ObjectId,
            ref: 'Pedidos'
        }
    ],
    calificacion: {
        promedio: {
            type: Number,
            default: 0
        },
        puntosTotales: {
            type: Number,
            default: 0
        },
        numPersonas: {
            type: Number,
            default: 0
        },
        comentarios: [
            {
                comentario: String,
                cliente: {
                    type: Schema.ObjectId,
                    ref: 'UsuariosModelo'
                },
                fecha: {
                    type: Date,
                    default: Date.now
                }
            }
        ]
    }
});

const PrestadorModelo = UsuariosModelo.discriminator('2', prestadorSchema);

module.exports = PrestadorModelo;