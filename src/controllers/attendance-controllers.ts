import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS, HttpCode, MAX_BEGIN_HOURS, MAX_END_HOURS } from "@src/core/constant";
import { customRequest } from "@src/core/interfaces/interfaces";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from 'express';


const attendanceControllers = {
    //* Saving Comming Hours
    beginOfAttendance: async (req: customRequest, res: Response): Promise<void> => {
        try {
            // fetch employeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employee id is given...");

            // Check if employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // Initialise date
            const today = new Date()
            const dateOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            log.debug(`Date of today: ${dateOfToday}`);

            // Check if employee had ever sign  in
            const attendanceExist = await prisma.attendance.findFirst({
                where: {
                    employeeID: employee.employee_id,
                    date: dateOfToday
                }
            })
            if (attendanceExist) {
                log.warn("You cannot sign to times in the day, ... !");
                return exceptions.conflict(res, "Attendance already recorded for today !");
            }
            log.info("is the first times to sign...");

            // Get Coming Hours
            let commingHours = today.getHours();
            let commingMinute = today.getMinutes();

            // Rounded hours and minutes
            if (commingMinute >= 45) {
                commingHours += 1;
                commingMinute = 0;
            } else if (commingMinute >= 15) {
                commingMinute = 30;
            } else {
                commingMinute = 0;
            }
            commingHours = Math.min(commingHours, MAX_END_HOURS);

            today.setHours(commingHours, commingMinute, 0, 0);
            log.debug(`value of tuday: ${today}`);

            // Get abscence hours and create abscence hours if necessary
            const abscencesHours = commingHours - MAX_BEGIN_HOURS;
            if (abscencesHours > 0) {
                await prisma.absence.create({
                    data: {
                        employeeID: employeeID,
                        date: dateOfToday,
                        absenceHours: abscencesHours
                    }
                })
            }

            // Save comming Hours
            const attendance = await prisma.attendance.create({
                data: {
                    employeeID: employee.employee_id,
                    date: dateOfToday,
                    startTime: today,
                }
            });
            if (!attendance) {
                log.warn("Failed to save attendance...");
                return exceptions.badRequest(res, 'error ading attendance !');
            }

            // Return success message
            log.info('attendance save successufly');
            res
                .status(HttpCode.CREATED)
                .json({ msg: `comming hours save for the  ${attendance.startTime.getDate()}/${attendance.startTime.getMonth() + 1}/${attendance.startTime.getFullYear()}, at ${attendance.startTime.getHours()}H ${attendance.startTime.getMinutes()}Min` })!
        } catch (error) {
            log.error("error when saving employee attendance !");
            return exceptions.serverError(res, error);
        }
    },

    //* Saving Comme out Hours
    endOfAttendance: async (req: customRequest, res: Response): Promise<void> => {
        try {
            // fetch employeID from authentication
            const employeeID = req.employee?.employee_id;
            if (!employeeID) {
                log.warn("Authentication error: No employeeID found in request")
                return exceptions.unauthorized(res, "authentication error !");
            }
            log.info("employee id exist...");

            // Check if employee employee exist
            const employee = await prisma.employee.findUnique({ where: { employee_id: employeeID } })
            if (!employee) {
                log.warn(`employee with id: ${employeeID} not exist !`);
                return exceptions.notFound(res, "employee not exist !");
            }
            log.info("employee exist...");

            // Initialise date
            const today = new Date()
            const dateOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            log.debug(`Date of today: ${dateOfToday}`);

            // Check if employee had ever signin In the morning 
            const attendance = await prisma.attendance.findFirst({
                where: {
                    employeeID,
                    date: dateOfToday
                }
            })
            if (!attendance) {
                log.warn("Add not sign in the morning...")
                return exceptions.badRequest(res, "did not register upon arrival");
            }

            //! Check if employee ever recorded the evening 


            // Get Coming Hours and Set time of ending time of the day
            let endingHours = today.getHours();
            let endingMinutes = today.getMinutes();
            if (endingMinutes >= 45) {
                endingHours += 1;
                endingMinutes = 0;
            } else if (endingMinutes >= 15) {
                endingMinutes = 30;
            } else {
                endingMinutes = 0;
            }
            endingHours = Math.min(endingHours, MAX_END_HOURS);
            today.setHours(endingHours, endingMinutes, 0, 0);
            log.debug(`value of today: ${today}`);

            const beginHours = attendance.startTime.getHours();
            const hours_worked = endingHours - beginHours;

            // Get abscence hours
            const newAbscencesHours = Math.max(HOURS_OF_WORKS - hours_worked, 0);
            let totalAbscenceHours = newAbscencesHours;

            // fetch abscences hours of morning
            const previousAbscence = await prisma.absence.findFirst({
                where: {
                    employeeID,
                    date: dateOfToday
                }
            })

            if (previousAbscence) {
                totalAbscenceHours = Math.min(newAbscencesHours + previousAbscence.absenceHours, HOURS_OF_WORKS);

                // update abscence hours
                await prisma.absence.update({
                    where: {
                        absence_id: previousAbscence.absence_id
                    },
                    data: { employeeID, date: dateOfToday, absenceHours: totalAbscenceHours }
                })
            } else {
                totalAbscenceHours = newAbscencesHours;

                // create abscence hours
                await prisma.absence.create({
                    data: { employeeID, date: dateOfToday, absenceHours: totalAbscenceHours }
                })
            }

            // sort by date all the attendance of that employee 
            const updateAttendance = await prisma.attendance.update({
                where: {
                    attendance_id: attendance.attendance_id
                },
                data: {
                    endTime: today
                }
            });
            if (!updateAttendance) return exceptions.notFound(res, "error when added end of attendance!");

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.CREATED)
                .json({ msg: `${attendance.startTime.getDate()}/${attendance.startTime.getMonth() + 1}/${attendance.startTime.getFullYear()}, at ${attendance.startTime.getHours()}H ${attendance.startTime.getMinutes()}Min` })!
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },

    //* consult employee Attendances
    consultAttendances: async (req: Request, res: Response): Promise<void> => {
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

            // sort by date all the attendances of that employee 
            const attendances = await prisma.attendance.findMany({
                where: {
                    employeeID
                },
                orderBy: {
                    date: 'desc'
                },
                select: {
                    date: true,
                    startTime: true,
                    endTime: true,
                }
            });
            if (!attendances) {
                log.warn("Not attendence found");
                return exceptions.badRequest(res, "Not attendance found for this employee !");
            }

            const infoAttendance = {
                employeInfo: {
                    "name": employee.name,
                    "email": employee.email,
                    "post": employee.post,
                    "salary": employee.salary
                },
                attendances
            }

            // Return success message
            log.info("all done successfully !");
            res
                .status(HttpCode.OK)
                .json({ msg: infoAttendance })
        } catch (error) {
            log.error("error occured when try consult employee attendances !");
            return exceptions.serverError(res, error);
        }
    }

}

export default attendanceControllers;