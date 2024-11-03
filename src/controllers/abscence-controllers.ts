import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS, HttpCode } from "@src/core/constant";
import calculateAbscenceHours from "@src/functions/calculateAbscenceHours";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from "express";

const abscencesControllers = {
    abscencesHours: async (req: Request, res: Response) => {
        try {
            const { employeeID } = req.params
            if (!employeeID) {
                log.warn("Should provide employeeID");
                return exceptions.badRequest(res, "No employeeID provide !");
            }
            log.info("employeeID is provided...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } });
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            const totalHours = await calculateAbscenceHours(employeeID)
            log.info(`Total hours of absence for employee ${employeeID} in the current month: ${totalHours}`);

            // Return success message
            log.info('All is ok !');
            res
                .status(HttpCode.CREATED)
                .json({ msg: totalHours })
        } catch (error) {
            log.error("error occured when try to get abscences of employee !")
            return exceptions.serverError(res, error);
        }
    },

    abscencesAdjustments: async (req: Request, res: Response) => {
        try {
            const { employeeID } = req.params
            if (!employeeID) {
                log.warn("Should provide employeeID");
                return exceptions.badRequest(res, "No employeeID provide !");
            }
            log.info("employeeID is provided...");

            // check if employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } });
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            //  Fetch hours salary
            const totalHours = await calculateAbscenceHours(employeeID);
            log.debug(`Total abscences Hours: ${totalHours}`);

            // fetch salary of this employee
            const employeeSalary = employee.salary;
            const hoursSalary = (employeeSalary) / (HOURS_OF_WORKS * 30);
            log.debug(`Employee Salary: ${employeeSalary}\n Salary By Hours: ${hoursSalary} !`);

            // Amount Reduction
            const reduction = hoursSalary * totalHours;
            log.debug(`Montant de reduction: ${reduction}`);
            const newSalary = parseFloat((employeeSalary - reduction).toFixed(2));
            log.debug(`Nouveau salaire: ${newSalary}`);

            // Return success message
            res
                .status(HttpCode.OK)
                .json({ msg: newSalary })
        } catch (error) {
            log.error("error occured when try adjust employee salary !")
            return exceptions.serverError(res, error);
        }
    }
}
export default abscencesControllers;