const fs = require('fs').promises;

/**
 * Elimina la imagen del servidor cuando la imagen almacenada en la BD es cambiada
 * 
 * @param {string} nombreImg Nombre de la imagen a elminar
 * @param {string} tipo Si la imagen es de un 'usuario' o un 'servicio'
 */
const eliminarImg = (nombreImg, tipo = null) => {
    let carpeta

    if (tipo != null) {
        if (tipo == 'usuario') carpeta = 'users';
        else if (tipo == 'servicio') carpeta = 'services';
        else carpeta = tipo;
    } else carpeta = tipo;

    // Validar que no sea la imagen por defecto
    if (nombreImg != 'default_user.jpg' && nombreImg != 'default_service.jpg') {
        const rutaEliminar = `./uploads/images/${carpeta}/${nombreImg}`;

        // Eliminar imagen
        fs.unlink(rutaEliminar)
            .then( () => console.log('Imagen eliminada') )
            .catch( err => console.log(`Error: ${err}`) )
    }
}

module.exports = eliminarImg;