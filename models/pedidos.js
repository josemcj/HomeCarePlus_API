const mongoose = require('mongoose');
const { Schema } = mongoose;

const pedidoSchema = new Schema({
    servicio: {
        type: Schema.ObjectId,
        ref: 'Servicios'
    },
    cliente: {
        type: Schema.ObjectId,
        ref: 'UsuariosModelo'
    },
    fechaServicio: {
        type: Date,
        required: true
    },
    fechaPedido: {
        type: Date,
        default: Date.now
    },
    estado: {
        type: String,
        default: 'Solicitado'
    }
});

const PedidosModelo = mongoose.model('Pedidos', pedidoSchema);

module.exports = PedidosModelo;