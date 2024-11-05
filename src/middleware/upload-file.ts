import multer from "multer";
import multerS3 from "multer-s3"
import s3 from "../core/config/s3";
import { envs } from "../core/config/env";
import path from "path";
import log from "@src/core/config/logger";
import { allowedExtensionsProfile, allowMimeTypeProfile } from "@src/core/constant";
import { v4 as uuidv4 } from 'uuid'
import exceptions from "@src/utils/errors/exceptions";

// Middleware pour multer le telechargement des fichiers sur le bucketS3/Minio
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: envs.AWS_BUCKET_NAME,
        acl: "private",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, callback) {
            const uniqueSuffix = `${uuidv4()}-${file.originalname}`;
            callback(null, uniqueSuffix)
        },
    }),

    limits: {
        fileSize: 15 * 1024 * 1024 // Set Maxsize of file to to 15Mo
    },

    fileFilter: (req, file, cb) => {
        const extension = path.extname(file.originalname).toLowerCase();
        const mimeType = file.mimetype;

        // Controler l'extension du fichier que l'utilisateur entre
        if (!allowedExtensionsProfile.includes(extension)) {
            log.warn(`Unsupported file format : ${extension}`);
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.filename) as unknown as null, false);
        }
 
        // Controler le type MIME du fichier que l'utilisateur entre
        if (!allowMimeTypeProfile.includes(mimeType)) {
            log.warn(`Unsupported file format : ${mimeType}`);
            return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.filename) as unknown as null, false);
        }

        cb(null, true);
    }
});

// Gestion globale des erreurs multer
const handleMulterErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Gestion des erreurs spécifiques à multer
        switch (err.code) {
            case 'LIMIT_FILE_SIZE':
                return exceptions.badRequest(res, "File too large. Maximum size is 15MB.");
            break;
      
            case 'LIMIT_UNEXPECTED_FILE':
                return exceptions.badRequest(res, "Unsupported file type or MIME.");
            break;
      
            default:
                return exceptions.badRequest(res, err.message);
            break;
        }
    }

    // Gestion des erreurs génériques
    next(err);
};

export { upload, handleMulterErrors };
