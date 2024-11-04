import abscencesControllers from "@src/controllers/abscence-controllers";
import { RoleUser } from "@src/core/interfaces/interfaces";
import authUser from "@src/middleware/authUser";
import roleEmployee from "@src/middleware/roleUser";
import ROUTES from "@src/utils/mocks/mocks-routes";
import { Router } from "express";


const abscence = Router();

abscence.get(
    ROUTES.ABSCENCES.GET_ABSCENCES, 
    abscencesControllers.abscencesHours
);

abscence.get(
    ROUTES.ABSCENCES.GET_SALARY, 
    abscencesControllers.abscencesAdjustments
);

abscence.post(
    ROUTES.ABSCENCES.DISGRACE_EMPLOYEE, 
    authUser,
    roleEmployee(RoleUser.admin),
    abscencesControllers.disgraceEmployee
);

export default abscence;