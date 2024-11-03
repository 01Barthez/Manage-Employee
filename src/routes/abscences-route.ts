import abscencesControllers from "@src/controllers/abscence-controllers";
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

export default abscence;