import { NextFunction, Response } from "express";
import exceptions from "../utils/errors/exceptions";
import prisma from "../core/config/prismaClient";
import { customRequest } from "../core/interfaces/interfaces";
import log from "@src/core/config/logger";
import { RoleUser } from "@prisma/client";

const roleUser = (role: RoleUser) => {
    return async (
        req: customRequest,
        res: Response,
        next: NextFunction,
    ) => {
        try {
            // fetch employeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) return exceptions.unauthorized(res, "authentification error !");

            // Check if employee employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) return exceptions.badRequest(res, "employee not found !");

            if (employee.role !== role) return exceptions.forbiden(res, "You are not allow to do this action !");

            log.info("employee role verified !")
            next()
        } catch (error) {
            return exceptions.serverError(res, error);
        }
    }
}

export default roleUser;