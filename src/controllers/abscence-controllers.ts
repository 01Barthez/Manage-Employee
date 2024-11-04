import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS, HttpCode } from "@src/core/constant";
import { customRequest } from "@src/core/interfaces/interfaces";
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
                .status(HttpCode.OK)
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
            const newSalary = Math.round((employeeSalary - reduction) /  50) * 50;
            log.debug(`Nouveau salaire: ${newSalary}`);

            // Return success message
            res
                .status(HttpCode.OK)
                .json({ msg: newSalary })
        } catch (error) {
            log.error("error occured when try adjust employee salary !")
            return exceptions.serverError(res, error);
        }
    },

    disgraceEmployee: async (req: customRequest, res: Response): Promise<void> => {
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

            // Initialise date
            const today = new Date()
            const dateOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            log.debug(`Date of today: ${dateOfToday}`);

            await prisma.absence.deleteMany({
                where: {
                    date: dateOfToday,
                    employeeID
                }
            })
            log.info("Abscence of the day of the employee delete successfully");

            // save the status of employee
            await prisma.employee.update({
                where: { employee_id: employeeID },
                data: { isComeAndBack: true }
            })
            log.info("status of the employee update to sign");

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.OK)
                .json({ msg: `we pardon employee ${employee.name}...!` });
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },
}
export default abscencesControllers;