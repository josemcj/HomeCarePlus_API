const bcrypt = require('bcrypt');
const UsuariosModelo = require('../models/usuarios');
const PrestadorModelo = require('../models/usuarios.prestador');
const ClienteModelo = require('../models/usuarios.cliente');
const eliminarImg = require('../helpers/eliminarImg');
const uploadImage = require('../helpers/uploadImage');

const addUsuario = async (req, res) => {
    const user = await UsuariosModelo.find({ email: req.body.email }).exec();

    // Valida que el usuario no este registrado
    if (!user.length) {

        /**
         * @typedef {Object} usuario
         * @property {string} usuario.tipoUsuario Cliente: 1, Prestador: 2
         * @property {string} usuario.sexo Femenino: 1, Masculino: 2
         */
        let usuario;

        await bcrypt.hash(req.body.contrasena, 10).then(hash => {
            if (req.body.tipoUsuario == 1) {
                usuario = new ClienteModelo({
                    nombre: req.body.nombre,
                    email: req.body.email,
                    contrasena: hash,
                    telefono: req.body.telefono,
                    sexo: req.body.sexo,
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
                    sexo: req.body.sexo,
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

const login = async (req, res) => {
    const email = req.body.email ? req.body.email : null;
    const password = req.body.contrasena ? req.body.contrasena : null;

    await UsuariosModelo.findOne({ email: email }).exec()
        .then(usuario => {
            if (usuario) {

                bcrypt.compare(password, usuario.contrasena, (err, resultado) => {
                    if (resultado) {
                        // La contraseña coincide
                        res.status(200).json({
                            code: 200,
                            message: 'Bienvenido',
                            usuario: usuario
                        });
                    } else {
                        // La contraseña es incorrecta
                        res.status(403).json({ code: 403, message: 'Contraseña incorrecta' });
                    }
                });

            } else {
                res.status(404).json({ code: 404, message: 'El usuario no está registrado' })
            }
        })
        .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) )
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

// Obtener un usuario por su ID
const getUsuario = async (req, res) => {
    await UsuariosModelo.findById(req.params.idUsuario).exec()
        .then(usuario => {

            if (usuario) {
                res.status(200).json({
                    code: 200,
                    usuario: usuario
                });
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'El usuario no existe'
                });
            }

        })
        .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) );
}

// Actualizar usuario (excepto email y contraseña)
const updateUsuario = async (req, res) => {
    const idUsuario = { _id: req.params.idUsuario };
    const imagenBase64 = req.body.imagen ? req.body.imagen : '';
    let usuarioDatosActualizar = {};
    let imagenNueva;
    const usuarioActualizar = await UsuariosModelo.findById(req.params.idUsuario).exec();
    // let imagenUsuario = req.file ? req.file.filename : 'default_user.jpg'; -> Subida con Multer

    // Validar si el usuario tiene imagen -> Aun no funciona si el usuario desea borrar la imagen
    /* Subida con Multer
    if (usuarioActualizar.imagen != 'default_user.jpg') {
        if (req.file) {
            imagenUsuario = req.file.filename;
            eliminarImg(usuarioActualizar.imagen, 'usuario');
        }
        else imagenUsuario = usuarioActualizar.imagen
    }
    */

    // Validar que exista la imagen -> Subida de imagenes base64
    if (imagenBase64.length) {
        imagenNueva = uploadImage(imagenBase64, 'usuario');

        if (imagenNueva != false) {
            // Eliminar imagen anterior
            eliminarImg(usuarioActualizar.imagen, 'usuario');
        }
        else imagenNueva = usuarioActualizar.imagen;
    } else imagenNueva = usuarioActualizar.imagen;

    usuarioDatosActualizar = {
        nombre: req.body.nombre,
        telefono: req.body.telefono,
        sexo: req.body.sexo,
        imagen: imagenNueva,
        direccion: {
            calle: req.body.calle,
            numero: req.body.numero,
            cp: req.body.cp,
            colonia: req.body.colonia,
            municipio: req.body.municipio,
            estado: req.body.estado
        }
    }

    if (usuarioActualizar.tipoUsuario == 2) {
        // Actualizar prestador
        usuarioDatosActualizar.profesion = req.body.profesion;

        await PrestadorModelo.findOneAndUpdate(idUsuario, usuarioDatosActualizar, { new: true })
            .then(usuario => {
                res.status(200).json({
                    code: 200,
                    message: 'Datos actualizados correctamente',
                    usuario: usuario
                });
            })
            .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) );

    } else if (usuarioActualizar.tipoUsuario == 1) {
        // Actualizar cliente
        await ClienteModelo.findOneAndUpdate(idUsuario, usuarioDatosActualizar, { new: true })
            .then(usuario => {
                res.status(200).json({
                    code: 200,
                    message: 'Datos actualizados correctamente',
                    usuario: usuario
                });
            })
            .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) );
    }
}

// Eliminar un usuario por su ID
const deleteUsuario = async (req, res) => {
    // Obtener imagen a eliminar
    const { imagen } = await UsuariosModelo.findById(req.params.idUsuario).exec();

    UsuariosModelo.findByIdAndRemove(req.params.idUsuario, (err, usuarioEliminado) => {
        if (!err) {
            eliminarImg(imagen, 'usuario');

            if (usuarioEliminado) {
                res.status(200).json({
                    code: 200,
                    message: 'Usuario eliminado correctamente',
                    usuarioEliminado: usuarioEliminado
                });
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'El usuario no existe'
                });
            }
        }
        else res.status(500).json({ code: 500, message: 'Ha ocurrido un error' });
    });
}

module.exports = {
    addUsuario,
    login,
    getUsuarios,
    getUsuario,
    updateUsuario,
    deleteUsuario
}