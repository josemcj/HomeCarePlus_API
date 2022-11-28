const bcrypt = require('bcrypt');
const { Usuario } = require('../models/usuarioCliente');

/**
 * USUARIOS CLIENTES
 * 
 * tipoUsuario = 1
 */

// Obtener todos los clientes
const getClientes = (req, res) => {
    Usuario.find({}, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    });
}

// Obtener cliente por ID
const getCliente = (req, res) => {
    Usuario.findById(req.params.id, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    });
}

// Registrar cliente
const addCliente = (req, res) => {
    // Crear hash
    bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
        if (!err) {
            const contrasenaHash = hash;

            const usuarioCliente = new Usuario({
                nombre: req.body.nombre,
                email: req.body.email,
                contrasena: contrasenaHash,
                telefono: req.body.telefono,
                tipoUsuario: 1,
                direccion: {
                    calle: req.body.calle,
                    numero: req.body.numero,
                    cp: req.body.cp,
                    colonia: req.body.colonia,
                    municipio: req.body.municipio,
                    estado: req.body.estado
                }
            });

            // Guardar usuario en la base de datos
            usuarioCliente.save((err, data) => {
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

// Actualizar cliente
const updateCliente = (req, res) => {
    const usuarioCliente = {
        nombre: req.body.nombre,
        email: req.body.email,
        contrasena: req.body.contrasena,
        telefono: req.body.telefono,
        tipoUsuario: 1,
        direccion: {
            calle: req.body.calle,
            numero: req.body.numero,
            cp: req.body.cp,
            colonia: req.body.colonia,
            municipio: req.body.municipio,
            estado: req.body.estado
        }
    }

    Usuario.findByIdAndUpdate(req.params.id, { $set: usuarioCliente }, { new: true }, (err, data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: 'Cliente actualizado correctamente',
                usuarioActualizado: data
            });
        } else {
            console.log(err);
        }
    });
}

// Eliminar cliente
const deleteCliente = (req, res) => {
    Usuario.findByIdAndRemove(req.params.id, (err, data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: 'Usuario eliminado correctamente',
                usuarioEliminado: data
            });
        } else {
            console.log(err);
        }
    });
}

// Login
const loginClientes = (req, res) => {
    const email = req.body.email ? req.body.email : null;
    const password = req.body.contrasena ? req.body.contrasena : null;

    Usuario.findOne({ email: email }, (err, user) => {
        if (!err) {
            if (user) {

                bcrypt.compare(password, user.contrasena, (err, check) => {
                    if (check) {
                        // La contraseña coincide
                        res.status(200).json({
                            code: 200,
                            message: 'Bienvenido',
                            usuario: user
                        });
                    } else {
                        // La contraseña es incorrecta
                        res.status(403).json({ code: 403, message: 'Contraseña es incorrecta' });
                    }
                });

            } else {
                // No encontro al usuario, por tanto no esta registrado
                res.status(404).json({ code: 404, message: 'El usuario no está registrado' });
            }
        } else {
            res.status(500).json({ code: 500, message: 'Ha ocurrido un error' });
        }
    });
}

module.exports = {
    getClientes,
    getCliente,
    addCliente,
    updateCliente,
    deleteCliente,
    loginClientes
}