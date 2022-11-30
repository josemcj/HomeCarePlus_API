const bcrypt = require('bcrypt');
const usuarioModelo = require('../models/usuarios');

/**
 * Usuarios
 * tipoUsuario = 1 (clientes), 2 (prestadores)
 */

const addUsuario = (req, res) => {
    bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
        if (!err) {

            const usuario = new usuarioModelo({
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

            if (req.body.tipoUsuario == 2) {
                usuario.profesion = req.body.profesion;
            }

            // Guardar usuario en la base de datos
            usuario.save((err, data) => {
                if (!err) {
                    res.status(200).json({
                        code: 200,
                        message: 'Usuario registrado correctamente',
                        usuarioRegistrado: data
                    });
                } else {
                    res.status(500).json({
                        code: 500,
                        message: 'Ha ocurrido un error',
                    });
                }
            });

        } else {
            res.status(500).json({ code: 500, message: 'Ha ocurrido un error' });
        }
    });
}

module.exports = {
    addUsuario
}