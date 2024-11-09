import { Request, Response, NextFunction } from "express";
import exceptions from "@src/utils/errors/exceptions";
import multer from "multer";


// Gestion globale des erreurs multer
const handleMulterErrors = (err, req: Request, res: Response, next: NextFunction) => {
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

export default handleMulterErrors;