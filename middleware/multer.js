const path = require('path');
const multer = require('multer');
const { fileURLToPath } = require('url');
const { extname } = require('path');

const mimeTypesPermitidos = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/users/');
    },
    filename: (req, file, cb) => {
        const nombreImg = `${Date.now()}${extname(file.originalname)}`;
        cb(null, nombreImg);
    }
});

const uploadImg = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (mimeTypesPermitidos.includes(file.mimetype)) cb(null, true);
        else cb('Formato no permitido', false)
    },
    limits: {
        fieldSize: 5000000
    }
});

const uploadImage = (req, res, next) => {
    const upload = uploadImg.single('imagenUsuario');

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir la imagen
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error al subir la imagen'
            });
        } else if (err) {
            // Error por formato o tamaño de la imagen
            res.status(500).json({
                code: 500,
                message: 'El formato no es permito o el archivo es demasiado grande'
            });
        }

        next();
    })
}

module.exports = uploadImage;