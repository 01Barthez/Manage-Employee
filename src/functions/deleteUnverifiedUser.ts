import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";

// Fonction qui va se charger de supprimer tous les otp mis a null a minuit tous les jours
const DeleteUnverified = async () => {
    try {
        await prisma.employee.deleteMany({ where: { verified: false } });
    } catch (error) {
        log.error('Failed to delete unverified employees:', {
            message: error instanceof Error ? error.message : "Unknown error occurred",
        });
        throw new Error(error instanceof Error ? error.message : "Unknow error occured");
    }
}

export default DeleteUnverified