import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";


/**
 * Calcule le total des heures d'absence d'un employé pour le mois en cours.
 * @param employeeID - L'identifiant de l'employé
 * @returns Le nombre total d'heures d'absence pour le mois en cours
 */

const calculateAbscenceHours = async (employeeID: string): Promise<number> => {
    try {
        // Obtenir le début et la fin du mois en cours
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

        // Récupérer les absences de l'employé pour le mois en cours
        const absences = await prisma.absence.findMany({
            where: {
                employeeID: employeeID,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            select: { absenceHours: true },
        });

        // Calculer la somme totale des heures d'absence
        const totalHours = absences.reduce((sum, absence) => sum + absence.absenceHours, 0);

        return totalHours;
    } catch (error) {
        log.error(`Error calculating absence hours for employee ${employeeID}:`, error);
        throw new Error("Erreur lors du calcul des heures d'absence");
    }
}

export default calculateAbscenceHours;