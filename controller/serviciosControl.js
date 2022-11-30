const { Servicios } = require('../models/servicios');
const usuarioModelo = require('../models/usuarios');

const addServicio = async (req, res) => {
    // Crear servicio
    const servicio = new Servicios(req.body);

    // Buscar prestador para asignar al servicio
    const prestador = await usuarioModelo.findById(req.params.idPrestador);

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

module.exports = { addServicio }