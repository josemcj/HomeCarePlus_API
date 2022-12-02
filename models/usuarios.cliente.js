const UsuariosModelo = require('./usuarios');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const clienteSchema = new Schema({
    serviciosContratados: [
        {
            type: Schema.ObjectId,
            ref: 'Servicios'
        }
    ]
});

const ClienteModelo = UsuariosModelo.discriminator('1', clienteSchema);

module.exports = ClienteModelo;