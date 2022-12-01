const { ServiciosModelo } = require('../models/servicios');
const { UsuariosModelo } = require('../models/usuarios');

// Registrar servicio
const addServicio = async (req, res) => {
    // Crear servicio
    const servicio = new ServiciosModelo(req.body);

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
    const servicio = await ServiciosModelo.findById(req.params.id).exec();
    const prestador = await UsuariosModelo.findById(servicio.prestadorDeServicio).exec();

    res.status(200).json({
        code: 200,
        servicio: servicio,
        prestador: prestador
    });
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

module.exports = {
    addServicio,
    getServicios,
    getServicio,
    getServiciosDePrestador
}