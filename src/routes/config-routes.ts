import configControllers from "@src/controllers/config-controllers";
import roleUser from "@src/middleware/roleUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";

const config = Router();

config.post(
    ROUTES.CONFIG.UPDATE,
    roleUser('Admin'),
    configControllers.updateConfig
)

config.post(
    ROUTES.CONFIG.CSRF_TOKEN,
    configControllers.getCSRFToken
);

export default config;