const bcrypt = require('bcrypt');
const { PrestadorDeServicios } = require('../models/usuarioPrestador');
// const { Servicios } = require('../models/servicios');

/**
 * PRESTADORES DE SERVICIOS
 * 
 * tipoUsuario = 2
 */

// Obtener todos los prestadores
const getPrestadores = (req, res) => {
    PrestadorDeServicios.find({}, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    });
}

// Obtener prestador por ID
const getPrestador = (req, res) => {
    PrestadorDeServicios.findById(req.params.id, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.log(err);
        }
    });
}

// Registrar prestador
const addPrestador = (req, res) => {
    // Crear hash
    bcrypt.hash(req.body.contrasena, 10, (err, hash) => {
        if (!err) {
            const contrasenaHash = hash;

            const usuarioPrestadorDeServicios = new PrestadorDeServicios({
                nombre: req.body.nombre,
                email: req.body.email,
                contrasena: contrasenaHash,
                telefono: req.body.telefono,
                tipoUsuario: 2,
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
        
            usuarioPrestadorDeServicios.save((err, data) => {
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

// Actualizar prestador
const updatePrestador = (req, res) => {
    const usuarioPrestadorDeServicios = {
        nombre: req.body.nombre,
        email: req.body.email,
        contrasena: req.body.contrasena,
        telefono: req.body.telefono,
        tipoUsuario: 2,
        profesion: req.body.profesion,
        direccion: {
            calle: req.body.calle,
            numero: req.body.numero,
            cp: req.body.cp,
            colonia: req.body.colonia,
            municipio: req.body.municipio,
            estado: req.body.estado
        }
    }

    PrestadorDeServicios.findByIdAndUpdate(req.params.id, { $set: usuarioPrestadorDeServicios }, { new: true }, (err, data) => {
        if (!err) {
            res.status(200).json({
                code: 200,
                message: 'Usuario actualizado correctamente',
                usuarioActualizado: data
            });
        } else {
            console.log(err);
        }
    });
}

// Eliminar prestador
const deletePrestador = (req, res) => {
    PrestadorDeServicios.findByIdAndRemove(req.params.id, (err, data) => {
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

// Login prestador
const loginPrestadores = (req, res) => {
    const email = req.body.email ? req.body.email : null;
    const password = req.body.contrasena ? req.body.contrasena : null;

    PrestadorDeServicios.findOne({ email: email }, (err, user) => {
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
    getPrestadores,
    getPrestador,
    addPrestador,
    updatePrestador,
    deletePrestador,
    loginPrestadores
}