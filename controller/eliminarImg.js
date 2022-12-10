const fs = require('fs').promises;

eliminarImg = (nombreImg, ruta = null) => {
    let carpeta

    if (ruta != null) {
        if (ruta == 'usuario') carpeta = 'users';
        else if (ruta == 'servicio') carpeta = 'services';
        else carpeta = ruta;
    } else carpeta = ruta;

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