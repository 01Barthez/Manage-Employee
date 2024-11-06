import configControllers from "@src/controllers/config-controllers";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";

const config = Router();

config.post(
    ROUTES.CONFIG.CSRF_TOKEN,
    configControllers.getCSRFToken
);

export default config;