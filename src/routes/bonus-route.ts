import bonusControllers from "@src/controllers/bonus-controllers";
import authUser from "@src/middleware/authUser";
import roleEmployee from "@src/middleware/roleUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const bonus = Router();

bonus.get(
    ROUTES.ABSCENCES.GET_ABSCENCES, 
    bonusControllers.getBonus
);

bonus.get(
    ROUTES.ABSCENCES.GET_SALARY, 
    authUser,
    roleEmployee('Manager'),
    bonusControllers.addBonus
);

export default bonus;