import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import {
    DAYS_OF_WORKS,
    HOURS_OF_WORKS,
    MIN_SALARY,
    SALARY_ROUND_FACTOR
} from "@src/core/constant";
import sendMail from "@src/services/mail/sendMail/send-mail";

const sendEmployeeSalary = async () => {
    try {
        const allEmployee = await prisma.employee.findMany();
        if (!allEmployee) throw new Error("Failed to fetch all the employees");
        log.debug("On a recuperer tous les employés !");

        // Obtenir les dates de début et de fin du mois précédent
        const now = new Date();
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        log.debug(`Debut du mois a considérer: ${startOfLastMonth} | Fin du mois:  ${endOfLastMonth}`);

        // Traiter chaque employé pour calculer et envoyer son salaire
        const sendAllSalaries = allEmployee.map(async (employee) => {
            log.debug(`Cas de l'employé: ${employee.name}`);

            // Récupérer les absences de l'employé pour le mois précédent
            const absences = await prisma.absence.findMany({
                where: {
                    employeeID: employee.employee_id,
                    date: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                },
                select: { absenceHours: true },
            });

            // Calculer le total des heures d'absence
            const totalHours = absences.reduce((sum, absence) => sum + absence.absenceHours, 0);

            // Calculer le salaire horaire et la réduction
            const employeeSalary = employee.salary;
            const hourlySalary = employeeSalary / (HOURS_OF_WORKS * DAYS_OF_WORKS);
            const reduction = hourlySalary * totalHours;
            const newSalary = Math.max(Math.round((employeeSalary - reduction) / SALARY_ROUND_FACTOR) * SALARY_ROUND_FACTOR, MIN_SALARY);

            log.debug(`Salaire original: ${employeeSalary} | Salaire par heure: ${hourlySalary}`);
            log.debug(`Heures d'absence: ${totalHours} | Montant de réduction: ${reduction}`);
            log.debug(`Nouveau salaire ajusté: ${newSalary}`);

            // Envoyer l'email de notification de salaire
            await sendMail(
                employee.email,
                'Notification de Salaire',
                'sendSalary',
                {
                    date: now,
                    name: employee.name,
                    salary: newSalary,
                }
            );
            log.debug(`Notification envoyée à ${employee.email}`);
        });

        await Promise.all(sendAllSalaries);
        log.info("Tous les employées sont notifiés sur leur salaire de fin du mois !");
    } catch (error) {
        const message = `Failed to notified all employee about their salary: ${error}`
        log.error(message);
        throw new Error(message);
    }
}

export default sendEmployeeSalary;