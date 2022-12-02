const bcrypt = require('bcrypt');
const UsuariosModelo = require('../models/usuarios');
const PrestadorModelo = require('../models/usuarios.prestador');
const ClienteModelo = require('../models/usuarios.cliente');

/**
 * Usuarios
 * tipoUsuario = 1 (clientes), 2 (prestadores)
 */

const addUsuario = async (req, res) => {
    const user = await UsuariosModelo.find({ email: req.body.email }).exec();

    // Valida que el usuario no este registrado
    if (!user.length) {
        
        let usuario;

        await bcrypt.hash(req.body.contrasena, 10).then(hash => {
            if (req.body.tipoUsuario == 1) {
                usuario = new ClienteModelo({
                    nombre: req.body.nombre,
                    email: req.body.email,
                    contrasena: hash,
                    telefono: req.body.telefono,
                    tipoUsuario: req.body.tipoUsuario,
                    direccion: {
                        calle: req.body.calle,
                        numero: req.body.numero,
                        cp: req.body.cp,
                        colonia: req.body.colonia,
                        municipio: req.body.municipio,
                        estado: req.body.estado
                    }
                });
            } else if (req.body.tipoUsuario == 2) {
                usuario = new PrestadorModelo({
                    nombre: req.body.nombre,
                    email: req.body.email,
                    contrasena: hash,
                    telefono: req.body.telefono,
                    tipoUsuario: req.body.tipoUsuario,
                    profesion: req.body.profesion,
                    direccion: {
                        calle: req.body.calle,
                        numero: req.body.numero,
                        cp: req.body.cp,
                        colonia: req.body.colonia,
                        municipio: req.body.municipio,
                        estado: req.body.estado
                    }
                });
            }
        })

        await usuario.save()
            .then(data => {
                res.status(200).json({
                    code: 200,
                    message: 'Usuario registrado correctamente',
                    usuarioRegistrado: data
                });
            })
            .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) )

    } else {
        res.status(405).json({
            code: 405,
            message: 'Este correo electrónico ya está registrado'
        });
    }
}

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    await UsuariosModelo.find({})
        .then(usuarios => {
            res.status(200).json({
                code: 200,
                datos: usuarios
            })
        })
        .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) )
}

module.exports = {
    addUsuario,
    getUsuarios
}