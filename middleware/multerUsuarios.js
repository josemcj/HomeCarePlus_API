const multer = require('multer');
const { extname } = require('path');

const mimeTypesPermitidos = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/users/');
    },
    filename: (req, file, cb) => {
        const nombreImg = `user_${ Date.now() }${ extname(file.originalname) }`;
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

const uploadImageUser = (req, res, next) => {
    const upload = uploadImg.single('imagen');

    upload(req, res, err => {
        if (err instanceof multer.MulterError) {
            // Error de Multer al subir la imagen
            res.status(500).json({
                code: 500,
                message: 'Ha ocurrido un error'
            });
        } else if (err) {
            // Error por formato o tamaño de la imagen
            res.status(400).json({
                code: 400,
                message: err
            });
            
        } else next();
    });
}

module.exports = uploadImageUser;