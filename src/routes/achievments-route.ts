import achievmentsControllers from "@src/controllers/achievment-controllers";
import authUser from "@src/middleware/authUser";
import roleEmployee from "@src/middleware/roleUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const bonus = Router();

bonus.get(
    ROUTES.ACHIEVMENTS.GET_ACHIEVMENTS, 
    achievmentsControllers.getAchievments
);

bonus.post(
    ROUTES.ACHIEVMENTS.CLEAR, 
    authUser,
    roleEmployee('Admin'),
    achievmentsControllers.clearAchievments
);

export default bonus;