import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import sendMail from "@src/services/mail/sendMail/send-mail";
import throwError from "@src/utils/errors/throwError";
import * as date from 'date-fns'
import { newSalary, reductionAmount } from "./getUserSalary";

const sendEmployeeSalary = async () => {
    try {
        const allEmployee = await prisma.employee.findMany({
            where: {
                deletedAt: null,
            }
        });
        if (!allEmployee.length) throwError("Failed to fetch all the employees", "and error occured");
        log.debug("On a recuperer tous les employés !");

        // Obtenir les dates de début et de fin du mois précédent
        const now = new Date();
        const previousMonth = date.subMonths(now, 1);
        const startOfLastMonth = date.startOfMonth(previousMonth);
        const endOfLastMonth = date.endOfMonth(previousMonth);
        log.debug(`Debut du mois a considérer: ${startOfLastMonth} | Fin du mois:  ${endOfLastMonth}`);

        // Traiter chaque employé pour calculer et envoyer son salaire
        await prisma.$transaction(async (tx) => {
            await Promise.all(
                allEmployee.map(async (employee) => {
                    const [totalBonus, totalHours] = await Promise.all([
                        tx.bonus.aggregate({
                            where: {
                                employeeID: employee.employee_id,
                                date: { gte: startOfLastMonth, lte: endOfLastMonth },
                            },
                            _sum: { amount: true },
                        }),
                        tx.absence.aggregate({
                            where: {
                                employeeID: employee.employee_id,
                                date: { gte: startOfLastMonth, lte: endOfLastMonth },
                            },
                            _sum: { absenceHours: true },
                        }),
                    ]);

                    const newEmployeeSalary = newSalary(
                        employee.salary, 
                        totalHours._sum.absenceHours || 0, 
                        totalBonus._sum.amount || 0
                    );
                    
                    await tx.payRoll.create({
                        data: {
                            employeeID: employee.employee_id,
                            baseSalary: employee.salary,
                            deduction: reductionAmount(employee.salary, totalHours._sum.absenceHours || 0),
                            bonuses: totalBonus._sum.amount || 0,
                            totalPay: newEmployeeSalary,
                            dateMonth: endOfLastMonth,
                        }
                    });

                    await sendMail(employee.email, 'New salary is available', 'sendSalary', {
                        date: now,
                        name: employee.name,
                        base_salary: employee.salary,
                        total_abscence: totalHours._sum.absenceHours || 0,
                        total_bonus: totalBonus._sum.amount || 0,
                        final_salary: newEmployeeSalary,
                    });
                })
            );
        });
        log.info("Tous les employées sont notifiés sur leur salaire de fin du mois !");
    } catch (error) {
        throwError(`Failed to notified all employee about their salary`, error);
    }
}

export default sendEmployeeSalary;