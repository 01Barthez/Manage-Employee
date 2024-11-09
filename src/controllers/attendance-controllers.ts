import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS, HttpCode, MAX_BEGIN_HOURS } from "@src/core/constant";
import { customRequest, IFilterAttendance, IPagination, IQueryDate } from "@src/core/interfaces/interfaces";
import exceptions from "@src/utils/errors/exceptions";
import { Request, Response } from 'express';
import * as date from 'date-fns'
import { roundedTime, roundHours } from "@src/functions/roundedHoursAndMinutes";
import ResponseMSG from "@utils/responseformat";
import { AttendenceStatus } from "@prisma/client";
import { fetchEmployeeFromAuth, fetchEmployeeFromParmams } from "@src/utils/helpers/fetchEmployee";
import * as datefn from 'date-fns'

const attendanceControllers = {
    //* Saving Comming Hours
    beginOfAttendance: async (req: customRequest, res: Response): Promise<void> => {
        try {
            // Fetch reason if exist
            const { reason } = req.body as { reason: string }

            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            // Initialise la date
            const today = new Date();
            const dateOfToday = date.startOfDay(today);
            log.debug(`Date of today: ${dateOfToday}`);

            // Verifier Que l'employee sign a une heure raisonnable et proche de l'heure du début
            if (today.getHours() < (MAX_BEGIN_HOURS - 2)) {
                log.warn("Il est encore trot tot pour le début des activités...");
                return exceptions.unauthorized(res, "It's too soon to check in... wait for after !");
            }
            log.debug("l'heure est raisonnable");

            // Check if employee had ever sign in in this day
            const attendanceExist = await prisma.attendance.findFirst({
                where: {
                    employeeID: employee?.employee_id,
                    date: dateOfToday
                }
            })
            if (attendanceExist) {
                log.warn("You cannot sign to times in the day, ... !");
                return exceptions.conflict(res, "Attendance already recorded for today !");
            }
            log.info("is the first times to sign...");

            // Get Coming Hours
            const commingHours = roundedTime().hours;
            const commingMinute = roundedTime().minutes;

            today.setHours(commingHours, commingMinute, 0, 0);
            log.info(`date of today: ${today}`);

            // Get abscence hours and create abscence hours if necessary
            const abscencesHours = Math.max(commingHours - MAX_BEGIN_HOURS, 0);

            // set Status of employee
            const status: AttendenceStatus = (abscencesHours !== 0) ? "Retard" : "Present"

            // Saving attendance and abscence if exist
            await prisma.$transaction(async (px) => {
                // Saving attendance if it's exist
                if (abscencesHours !== 0)
                    await px.absence.create({
                        data: {
                            employeeID: employee?.employee_id || '',
                            absenceHours: abscencesHours
                        }
                    })

                // Save comming Hours
                await px.attendance.create({
                    data: {
                        employeeID: employee?.employee_id || '',
                        startTime: today,
                        reason,
                        status
                    }
                });
            })

            // Return success message
            log.info('attendance save successufly');
            res
                .status(HttpCode.OK)
                .json(ResponseMSG(`Comming hours successfully saved`))
        } catch (error) {
            log.error("error when saving employee attendance !");
            return exceptions.serverError(res, error);
        }
    },

    //* Saving Comme out Hours
    endOfAttendance: async (req: customRequest, res: Response): Promise<void> => {
        try {
            const { accomplissement } = req.body as { accomplissement: string };

            // Check if employee exist and fetch his data
            const employee = await fetchEmployeeFromAuth(req, res);

            // Initialise date
            const today = new Date()
            const dateOfToday = date.startOfDay(today);
            log.debug(`Date of today: ${dateOfToday}`);

            // Check if employee had ever signin In the morning 
            const attendance = await prisma.attendance.findFirst({
                where: {
                    employeeID: employee?.employee_id,
                    date: dateOfToday
                }
            })
            if (!attendance) {
                log.warn("Add not sign in the morning...")
                return exceptions.badRequest(res, "did not register upon arrival");
            }

            // Check if employee ever recorded the evening 
            if (employee?.isComeAndBack) return exceptions.conflict(res, "Has ever sign out today...!")

            // Get Coming Hours and Set time of ending time of the day
            const endingHours = roundedTime().hours;
            const endingMinutes = roundedTime().minutes;

            // Set date of today with rounded hours and minutes
            today.setHours(endingHours, endingMinutes, 0, 0);
            log.debug(`value of today: ${today}`);

            // Get parameters of times
            const beginHours = attendance.startTime.getHours();
            const beginMinutes = attendance.startTime.getMinutes();
            const finalEndingHours = roundHours(endingHours, endingMinutes, beginMinutes)

            const hoursWorked = Math.max(finalEndingHours - beginHours, 0);

            // Get abscence hours
            const newAbscencesHours = Math.max(HOURS_OF_WORKS - hoursWorked, 0);
            let totalAbscenceHours = newAbscencesHours;

            // Transactions pour Sauvegarder une fin de journée 
            await prisma.$transaction(async (px) => {
                // Save abscence hours only if it's greater than 0
                if (newAbscencesHours > 0) {
                    // fetch abscences hours of morning
                    const previousAbscence = await px.absence.findFirst({
                        where: {
                            employeeID: employee?.employee_id,
                            date: dateOfToday
                        }
                    });

                    if (previousAbscence)
                        totalAbscenceHours = Math.min(newAbscencesHours + previousAbscence.absenceHours, HOURS_OF_WORKS);

                    // update abscence hours
                    await px.absence.upsert({
                        where: {
                            absence_id: previousAbscence?.absence_id
                        },
                        update: {
                            absenceHours: totalAbscenceHours
                        },
                        create: {
                            employeeID: employee?.employee_id || ``,
                            absenceHours: totalAbscenceHours
                        }
                    })
                }

                // Save the accomplishment of the employee
                await px.achievment.create({
                    data: {
                        employeeID: employee?.employee_id || ``,
                        message: accomplissement,
                    }
                })

                // save the end time of employee 
                await px.attendance.update({
                    where: {
                        attendance_id: attendance.attendance_id
                    },

                    data: {
                        endTime: today,
                        hoursWorked
                    }
                });

                // update the status of employee to true
                await px.employee.update({
                    where: {
                        deletedAt: null,
                        employee_id: employee?.employee_id
                    },
                    data: { isComeAndBack: true }
                })
            });

            // Return success message
            log.info("All is ok, success !")
            res
                .status(HttpCode.OK)
                .json(ResponseMSG(`${attendance.startTime.getDate()}/${attendance.startTime.getMonth() + 1}/${attendance.startTime.getFullYear()}, at ${attendance.startTime.getHours()}H ${attendance.startTime.getMinutes()}Min`))!
        } catch (error) {
            log.error("error occured when saving end of attendance !")
            return exceptions.serverError(res, error);
        }
    },

    //* consult employee Attendances
    consultAttendances: async (req: Request, res: Response): Promise<void> => {
        try {
            // Fetch employee data from params
            const employee = await fetchEmployeeFromParmams(req, res);
            if (!employee) return exceptions.badRequest(res, "Employee not found");

            // Fetch queries
            const { day, month, year } = req.query as IQueryDate
            const { page = 1, limit = 10 } = req.query as IPagination;

            // Actual Date
            let dateFilter: Date | undefined = undefined
            const now: Date = new Date();

            // Construct date dependly of parameters
            if (day || month || year) {

                dateFilter = datefn.startOfDay(now); // set to midnight
                if (day) {
                    // define date of the day
                    dateFilter = datefn.setDay(dateFilter, Number(day) - 1);
                }
                if (month) {
                    // define date of the month
                    dateFilter = datefn.setMonth(dateFilter, Number(month) - 1);
                }
                if (year) {
                    // define date of the year
                    dateFilter = datefn.setYear(dateFilter, Number(year));
                }
            }

            // Definit les conditions de filtre en fonction de la prsence ou non des attendences;
            const whereClause: IFilterAttendance = {
                employeeID: employee?.employee_id
            }
            if (dateFilter) whereClause.date = dateFilter

            // sort by date all the attendances of that employee 
            const Allattendances = await prisma.attendance.findMany({
                where: whereClause,
                orderBy: {
                    date: 'desc'
                },
                select: {
                    date: true,
                    startTime: true,
                    endTime: true,
                },
                take: Number(limit),
                skip: (Number(page) - 1) * Number(limit),
            });

            // Return success message
            log.info("all done successfully !");
            res
                .status(HttpCode.OK)
                .json(ResponseMSG("Success Operation", true, Allattendances))
        } catch (error) {
            log.error("error occured when try consult employee attendances !");
            return exceptions.serverError(res, error);
        }
    }
}

export default attendanceControllers;