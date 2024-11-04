import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS } from "@src/core/constant";


const updateStatusEmployee = async() => {
    try {
        // Selectioner tous ceux qui ont été abscent ou qui n'ont pas remplir les formalité de début et de fin
        const informelEmployee = await prisma.employee.findMany({where: {isComeAndBack: true}});

        // Remplir les abscences de tous ceux qui ne sont pas venu...
        const abscencesUpdate = informelEmployee.map(async (employee) => {
            return await prisma.absence.updateMany({
                where: {
                    employeeID: employee.employee_id
                },
                data: HOURS_OF_WORKS
            });
        })

        // Attendre que tout finisse
        await Promise.all(abscencesUpdate)

        // Mettre a jour les status pour la journée qui arrivent
        await prisma.employee.updateMany({
            where: {
                isComeAndBack: true
            },
            data: {
                isComeAndBack: false
            }
        })
    } catch (error) {
        log.error('Failed to update employee status: ', {
            message: error instanceof Error ? error.message : "Unknown error occurred",
        });
        throw new Error(error instanceof Error ? error.message : "Unknow error occured");
    }
}

export default updateStatusEmployee;