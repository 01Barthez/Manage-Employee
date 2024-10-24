import multer from "multer";
import multerS3 from "multer-s3"
import s3 from "../core/config/s3";
import { envs } from "../core/config/env";
import path from "path";
import log from "@src/core/config/logger";

// Middleware pour multer le telechargement des fichiers sur le bucketS3/Minio
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: envs.AWS_BUCKET_NAME,
        acl: "public-read",
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key(req, file, callback) {
            const uniqueSuffix = `${Date.now()}-${file.originalname}`;
            callback(null, uniqueSuffix)
        },
    }),

    limits: {
        fileSize: 10 * 1024 * 1024 // Set Maxsize of file to to 10Mo
    },

    fileFilter: function (req, file) {
        switch (path.extname(file.originalname).toLowerCase()) {
            case '.jpg':
            case '.png':
            case '.jpeg':
            case '.svg':
            case '.gif':
            break;

            default: log.error("Errorof format..."); throw new Error("Error of image format !")
            break;
        }
    }
});

export default upload;