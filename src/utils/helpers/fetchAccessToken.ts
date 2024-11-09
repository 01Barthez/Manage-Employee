import log from "@src/core/config/logger";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";


const fetchAccessToken = (req: Request, res: Response): string => {
    // Recuperation de l'access token dans le header authorisatioin
    const authHeader = req.headers['authorization'];
    // log.debug(`authHeader extracted: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        log.warn("Authorization header is malformed !");
        exceptions.unauthorized(res, "Malformed token.");
        return "";
    }
    const accessToken = authHeader.replace('Bearer Bearer', 'Bearer').split(" ")[1] || ""; // Because i don't know qhy but we often have two Bearer world...
    // log.debug(`Token extracted: ${accessToken}`);
    return accessToken;
}

export default fetchAccessToken;