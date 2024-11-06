import log from "@src/core/config/logger";
import { HttpCode } from "@src/core/constant";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";


const configControllers = {
    getCSRFToken:  async (req: Request, res: Response) => {
        try {
            log.info("Géneration d'un token CRSF... ");
            res
                .status(HttpCode.OK)
                .json({ csrfToken: req.csrfToken() });
        } catch (error) {
            log.error("Failed to generated CSRF Token !")
            return exceptions.serverError(res, error);
        }
    }
}

export default configControllers