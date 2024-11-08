import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import throwError from "@src/utils/errors/throwError";

// Fonction qui va se charger de supprimer tous les otp mis a null a minuit tous les jours
const DeleteUnverified = async () => {
    try {
        await prisma.employee.deleteMany({
            where: {
                deletedAt: null,
                verified: false
            }
        });

        await prisma.employee.updateMany({
            where: {
                deletedAt: null,
                verified: true
            },
            data: { otp: null }
        });
        log.info('employé non vérifié supprimé avec succès !');
    } catch (error) {
        throwError('Failed to delete unverified employees', error)
    }
}

export default DeleteUnverified