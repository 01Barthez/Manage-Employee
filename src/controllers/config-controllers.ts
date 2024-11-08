import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HttpCode } from "@src/core/constant";
import { configCache } from "@src/servicesConfig/configService";
import exceptions from "@src/utils/errors/exceptions";
import ResponseMSG from "@src/utils/responseformat";
import { Request, Response } from "express";


const configControllers = {
    updateConfig: async (req: Request, res: Response) => {
        try {
            const { key, value } = req.body;
            log.info("failed to load key and value for configuration! ");

            await prisma.$transaction(async () => {
                await prisma.setting.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                });

                // Mettre à jour la configuration en mémoire
                configCache[key] = value;

                res
                    .status(HttpCode.OK)
                    .json(ResponseMSG("configuration updated successfully !"));
            })
        } catch (error) {
            log.error("Failed to set configuration !")
            return exceptions.serverError(res, error);
        }
    },

    getCSRFToken: async (req: Request, res: Response) => {
        try {
            log.info("Géneration d'un token CRSF... ");
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("CSRF token generated successfully !", req.csrfToken()));
        } catch (error) {
            log.error("Failed to generated CSRF Token !")
            return exceptions.serverError(res, error);
        }
    },

}

export default configControllers