import multer from "multer";
import multerS3 from "multer-s3"
import path from "path";
import log from "@src/core/config/logger";
import { allowedExtensionsProfile, allowMimeTypeProfile } from "@src/core/constant";
import { v4 as uuidv4 } from 'uuid'
import s3 from "./s3";
import { envs } from "@src/core/config/env";
 
// Middleware pour multer le telechargement des fichiers sur le bucketS3/Minio
const uploadImage = multer({
    storage: multerS3({
        s3: s3,
        bucket: envs.AWS_BUCKET_NAME,
        acl: "private",
        metadata: (_req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(_req, file, callback) {
            const uniqueSuffix = `${file.originalname}-${uuidv4()}`;
            callback(null, uniqueSuffix)
        },
    }),

    limits: {
        fileSize: 15 * 1024 * 1024 // Set Maxsize of file to to 15Mo
    },

    fileFilter: (_req, file, cb) => {
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

export default uploadImage ;
