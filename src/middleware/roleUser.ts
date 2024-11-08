import { NextFunction, Response } from "express";
import exceptions from "../utils/errors/exceptions";
import { customRequest } from "../core/interfaces/interfaces";
import log from "@src/core/config/logger";
import { RoleUser } from "@prisma/client";
import fetchEmployee from "@src/functions/fetchEmployeeExist";

const roleUser = (role: RoleUser) => {
    return async (req: customRequest, res: Response, next: NextFunction) => {
        try {
            // Check if employee exist and fetch his data
            const employee = await fetchEmployee(req, res);

            // Si le role entrer est admin alors seul
            if (role === 'Admin') {
                if (employee?.role !== 'Admin') return exceptions.forbiden(res, "You are not allow to do this action !");
            } else if (role === 'Manager') {
                if (employee?.role !== 'Admin' && employee?.role !== 'Manager') return exceptions.forbiden(res, "You are not allow to do this action !");
            }

            log.info("employee role verified !")
            next()
        } catch (error) {
            return exceptions.serverError(res, error);
        }
    }
}

export default roleUser;