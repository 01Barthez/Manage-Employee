import { Request, Response } from "express";
import { HttpCode } from "@src/core/constant";
import ResponseMSG from "@src/utils/responseformat";
import exceptions from "@src/utils/errors/exceptions";
import log from "@src/core/config/logger";
import { fetchEmployeeFromParmams } from "@src/utils/helpers/fetchEmployee";
import prisma from "@src/core/config/prismaClient";


const bonusControllers = {
    addBonus: async (req: Request, res: Response) => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            // Fetch bonus amount from body
            const { amount , description } = req.body;

            // add bonus amount
            await prisma.bonus.create({
                data: {
                    employeeID: employee.employee_id,
                    amount,
                    description
                }
            })

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.CREATED)
                .json(ResponseMSG(`Employee bonus successfuy added !`));
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },

    getBonus: async (req: Request, res: Response) => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            // Fetch bonus amount from body
            const { amount , description } = req.body;

            // add bonus amount
            await prisma.bonus.create({
                data: {
                    employeeID: employee.employee_id,
                    amount,
                    description
                }
            })

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.CREATED)
                .json(ResponseMSG(`Employee bonus successfuy added !`));
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },
}
export default bonusControllers;