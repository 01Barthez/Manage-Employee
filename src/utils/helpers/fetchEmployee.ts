import { Employee } from "@prisma/client";
import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { customRequest } from "@src/core/interfaces/interfaces";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";


export const fetchEmployeeFromAuth = async (req: customRequest, res: Response): Promise<void | Employee> => {
    // fetch employeID from authentication
    const employeeID = req.employee?.employee_id;
    if (!employeeID) {
        log.warn("Authentication error: No employeeID found in request")
        return exceptions.unauthorized(res, "authentication error !");
    }
    log.info("employee ID exist for deconnexion...");

    // Check if employee employee exist
    const employee = await prisma.employee.findUnique({
        where: {
            employee_id: employeeID,
            deletedAt: null
        }
    })
    if (!employee) {
        log.warn(`employee with id: ${employeeID} not exist !`);
        return exceptions.notFound(res, "employee not exist !");
    }
    log.info("employee exist...");

    return employee as Employee;
}

export const fetchEmployeeFromParmams = async (req: Request, res: Response): Promise<void | Employee> => {
    const { employeeID } = req.params as { employeeID: string }

    if (!employeeID) {
        log.warn("Should provide employeeID");
        return exceptions.badRequest(res, "No employeeID provide !");
    }
    log.info("employeeID is provided...");

    // check if employee exist
    const employee = await prisma.employee.findUnique({
        where: {
            employee_id: employeeID,
            deletedAt: null
        }
    });
    if (!employee) {
        log.warn(`employee with id: ${employeeID} not exist !`);
        return exceptions.notFound(res, "employee not exist !");
    }
    log.info("employee exist...");

    return employee as Employee;
}
