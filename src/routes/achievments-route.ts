import achievmentsControllers from "@src/controllers/achievment-controllers";
import authUser from "@src/middleware/authUser";
import roleEmployee from "@src/middleware/roleUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const achievment = Router();

achievment.get(
    ROUTES.ACHIEVMENTS.GET_ACHIEVMENTS, 
    achievmentsControllers.getAchievments
);

achievment.post(
    ROUTES.ACHIEVMENTS.CLEAR, 
    authUser,
    roleEmployee('Admin'),
    achievmentsControllers.clearAchievments
);

export default achievment;