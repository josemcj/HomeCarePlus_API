const fs = require('fs');

/**
 * Convierte el string base64 recibido de Volley a una imagen
 */

const subirImgUsuario = async (imagenBase64) => {
    try {
        const nombreImg = `user_${ Date.now() }.jpg`;
        const path = `./uploads/images/users/${nombreImg}`;
    
        const base64Data = imagenBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '');
    
        // Subir la imagen
        fs.writeFileSync(path, base64Data, { encoding: 'base64' });

        return nombreImg;
    } catch (e) {
        return false;
    }
}

module.exports = subirImgUsuario;