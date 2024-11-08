import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import throwError from "@src/utils/errors/throwError";
import * as date from 'date-fns'

/**
 * Calcule le total des heures d'absence d'un employé pour le mois en cours.
 * @param employeeID - L'identifiant de l'employé
 * @returns Le nombre total d'heures d'absence pour le mois en cours
 */

const calculateAbscenceHours = async (employeeID: string): Promise<number> => {
    try {
        // Obtenir les dates de début et de fin du mois précédent
        const now = new Date();
        const startOfMonth = date.startOfMonth(now);
        const endOfMonth = date.endOfMonth(now);
        log.debug(`Debut du mois a considérer: ${startOfMonth} | Fin du mois:  ${endOfMonth}`);

        // Récupérer les absences de l'employé pour le mois en cours
        const absences = await prisma.absence.aggregate({
            where: {
                employeeID: employeeID,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            _sum: {
                absenceHours: true
            }
        });
        const totalHours = absences._sum.absenceHours || 0;

        return totalHours;
    } catch (error) {
        throwError('Failed to get summary abscences hours of employee', error);
        return 0;
    }
}

export default calculateAbscenceHours;