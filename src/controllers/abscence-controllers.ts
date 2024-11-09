import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { customRequest } from "@src/core/interfaces/interfaces";
import calculateAbscenceHours from "@src/functions/calculateAbscenceHours";
import exceptions from "@src/utils/errors/exceptions";
import { fetchEmployeeFromParmams } from "@src/utils/helpers/fetchEmployee";
import { Request, Response } from "express";
import ResponseMSG from "@src/utils/responseformat";
import { newSalary } from "@src/functions/getUserSalary";
import * as datefns from 'date-fns'
import { HttpCode } from "@src/core/constant";

const abscencesControllers = {
    abscencesHours: async (req: Request, res: Response) => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            const totalHours = await calculateAbscenceHours(employee.employee_id)
            log.info(`Total hours of absence for employee ${employee.email} in the current month: ${totalHours}`);

            // Return success message
            log.info('All is ok !');
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("All is correct", true, totalHours));
        } catch (error) {
            log.error("error occured when try to get abscences of employee !")
            return exceptions.serverError(res, error);
        }
    },

    abscencesAdjustments: async (req: Request, res: Response) => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            //  Fetch total hours
            const totalHours = await calculateAbscenceHours(employee.employee_id);
            log.debug(`Total abscences Hours: ${totalHours}`);

            // fetch salary of this employee
            const employeeSalary = employee.salary;

            const finalSalary = newSalary(employeeSalary, totalHours)
            log.debug(`Nouveau salaire: ${finalSalary}`);

            // Return success message
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("Success operation", true, finalSalary));
        } catch (error) {
            log.error("error occured when try adjust employee salary !")
            return exceptions.serverError(res, error);
        }
    },

    resetEmployeeAbsence: async (req: customRequest, res: Response): Promise<void> => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            // Initialise date
            const now = new Date()
            const dateOfToday = datefns.startOfDay(now);
            log.debug(`Date of today: ${dateOfToday}`);

            await prisma.$transaction(async (px) => {
                await px.absence.deleteMany({
                    where: {
                        employeeID: employee.employee_id,
                        date: dateOfToday
                    }
                })
                log.info("Abscence of the day of the employee delete successfully");

                // save the status of employee
                await px.employee.update({
                    where: {
                        employee_id: employee.employee_id,
                        deletedAt: null
                    },
                    data: { isComeAndBack: true }
                })
                log.info("status of the employee update to sign");
            })

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.OK)
                .json(ResponseMSG(`we pardon employee ${employee.name}...!`));
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },

    clearAbscences: async (_req: Request, res: Response) => {
        try {
            const deleteResult = await prisma.absence.deleteMany();

            const deletedCount = deleteResult.count;
            log.info(`Successfully deleted ${deletedCount} abscences'.`);
           
            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.CREATED)
                .json(ResponseMSG(`All abscences Successfully Clear !`));
        } catch (error) {
            log.error("error occured when try clear abscences !")
            return exceptions.serverError(res, error);
        }
    }
}
export default abscencesControllers;