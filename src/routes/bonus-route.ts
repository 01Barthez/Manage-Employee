import bonusControllers from "@src/controllers/bonus-controllers";
import authUser from "@src/middleware/authUser";
import roleEmployee from "@src/middleware/roleUser";
import { validate } from "@src/services/validator/validate";
import { validator } from "@src/services/validator/validator";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const bonus = Router();

bonus.get(
    ROUTES.BONUS.GET_BONUS, 
    bonusControllers.getBonus
);

bonus.post(
    ROUTES.BONUS.ADD_BONUS, 
    authUser,
    roleEmployee('Manager'),
    validator.DataBonus,
    validate,
    bonusControllers.addBonus
);

bonus.post(
    ROUTES.BONUS.CLEAR, 
    authUser,
    roleEmployee('Admin'),
    bonusControllers.clearBonus
);

export default bonus;