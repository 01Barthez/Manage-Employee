import abscencesControllers from "@src/controllers/abscence-controllers";
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
    roleEmployee('Manager'),
    abscencesControllers.resetEmployeeAbsence
);

abscence.post(
    ROUTES.ABSCENCES.CLEAR, 
    authUser,
    roleEmployee('Admin'),
    abscencesControllers.clearAbscences
);

export default abscence;