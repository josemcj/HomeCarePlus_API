const { ServiciosModelo } = require('../models/servicios');
const UsuariosModelo = require('../models/usuarios');
const eliminarImg = require('../helpers/eliminarImg');
const uploadImage = require('../helpers/uploadImage');

// Registrar servicio
const addServicio = async (req, res) => {
    let nombreImg;

    let servicio = new ServiciosModelo({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        precio: req.body.precio
    });

    // Subir imagen
    if (req.body.imagen) {
        nombreImg = uploadImage(req.body.imagen, 'servicio');
        if (nombreImg != false) servicio.imagen = nombreImg;
        else servicio.imagen = 'default_service.jpg';

    } else servicio.imagen = 'default_service.jpg';

    // Buscar prestador para asignar al servicio
    const prestador = await UsuariosModelo.findById(req.params.idPrestador);

    // Asignar el campo prestadorDeServicio de acuerdo al resultado en prestador
    servicio.prestadorDeServicio = prestador;

    // Guardar servicio
    await servicio.save()
        .then(servicioGuardado => {
            res.status(200).json({
                code: 200,
                message: 'Servicio creado correctamente',
                servicioCreado: servicioGuardado
            })
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error',
                error: err
            })
        })
    
    // Asignar el servicio dentro del arreglo serviciosPublicados de Usuarios
    prestador.serviciosPublicados.push(servicio);

    // Actualizar prestador con el nuevo servicio publicado
    await prestador.save();
}

// Listar todos los servicios existentes
const getServicios = async (req, res) => {
    await ServiciosModelo.find({})
        .then(datos => {

            // Validar que existan servicios
            if (datos.length) {
                res.status(200).json({
                    code: 200,
                    datos: datos
                });
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'No hay servicios publicados'
                });
            }
            
        })
        .catch(err => {
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error'
            });
        })
}

// Obtener info de un servicio
const getServicio = async (req, res) => {
    const servicio = await ServiciosModelo.findById(req.params.id).populate('prestadorDeServicio');

    if (servicio) {
        res.status(200).json({
            code: 200,
            servicio: servicio
        });
    } else {
        res.status(404).json({
            code: 404,
            message: 'Servicio no encontrado'
        });
    }
}

// Listar servicio de un usuario (para seccion "Mis servicios")
const getServiciosDePrestador = async (req, res) => {
    // Buscar al usuario y poblar el arreglo de servicios del prestador
    const prestador = await UsuariosModelo.findById(req.params.idPrestador).populate('serviciosPublicados');

    // Validar que el aarreglo no este vacio, es decir, que haya servicios publicados
    if (prestador.serviciosPublicados.length) {
        res.status(200).json({
            code: 200,
            datos: prestador.serviciosPublicados
        });
    } else {
        res.status(404).json({
            code: 404,
            message: 'No tienes servicios publicados'
        });
    }   
}

// Actualizar servicio (no actualiza imagen)
const updateServicio = async (req, res) => {
    const servicioActualizar = await ServiciosModelo.findById(req.params.idServicio).exec();
    const imagenBase64 = req.body.imagen ? req.body.imagen : '';
    let imagenNueva;

    // Validar que exista la imagen -> Subida de imagenes base64
    if (imagenBase64.length) {
        imagenNueva = uploadImage(imagenBase64, 'servicio');

        if (imagenNueva != false) {
            // Eliminar imagen anterior
            eliminarImg(servicioActualizar.imagen, 'servicio');
        }
        else imagenNueva = servicioActualizar.imagen;
    } else imagenNueva = servicioActualizar.imagen;

    const servicioDatosActualizar = {
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        imagen: imagenNueva,
        precio: req.body.precio
    }

    await ServiciosModelo.findOneAndUpdate({ _id: req.params.idServicio }, servicioDatosActualizar, { new: true })
        .then(servicio => {
            res.status(200).json({
                code: 200,
                message: 'Servicio actualizado correctamente',
                servicio: servicio
            });
        })
        .catch( err => res.status(500).json({ code: 500, message: 'Ha ocurrido un error' }) )
}

// Eliminar servicio
const deleteServicio = async (req, res) => {
    const prestador = await UsuariosModelo.findById(req.params.idPrestador);
    const servicio = await ServiciosModelo.findById(req.params.idServicio);

    // Eliminar servicio
    ServiciosModelo.findByIdAndRemove(req.params.idServicio, (err, servicioEliminado) => {
        if (!err) {
            eliminarImg(servicio.imagen, 'servicio');

            if (servicioEliminado) {
                res.status(200).json({
                    code: 200,
                    message: 'Servicio eliminado correctamente',
                    servicioEliminado: servicioEliminado
                });
            } else {
                res.status(404).json({
                    code: 404,
                    message: 'El servicio no existe'
                });
            }
        }
        else res.status(500).json({ code: 500, message: 'Ha ocurrido un error' });
    });

    // Eliminar referencia del arreglo serviciosPublicados del prestador
    prestador.serviciosPublicados.pull(servicio);
    await prestador.save();
}

/**
 * Buscar servicios por categoria
 */
const searchServicios = async (req, res) => {
    const categoria = req.query.cat;
    const servicios = await ServiciosModelo.find({ categoria: categoria }).exec();
    
    if (servicios.length) {
        res.status(200).json({
            code: 200,
            servicios: servicios
        });
    } else {
        res.status(404).json({
            code: 404,
            message: 'Sin resultados'
        });
    }
}

module.exports = {
    addServicio,
    getServicios,
    getServicio,
    getServiciosDePrestador,
    updateServicio,
    deleteServicio,
    searchServicios
}