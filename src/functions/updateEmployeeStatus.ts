import log from "@src/core/config/logger";
import prisma from "@src/core/config/prismaClient";
import { HOURS_OF_WORKS } from "@src/core/constant";
import throwError from "@src/utils/errors/throwError";


const updateStatusEmployee = async () => {
    try {
        await prisma.$transaction(async () => {
            // Selectioner tous ceux qui ont été abscent ou qui n'ont pas remplir les formalité de début et de fin
            const informelEmployee = await prisma.employee.findMany({
                where: {
                    deletedAt: null,
                    isComeAndBack: true
                }
            });

            // Fetch once all the data of abscents employee
            const abscencesData = informelEmployee.map((employee) => (
                {
                    employeeID: employee.employee_id,
                    absenceHours: HOURS_OF_WORKS
                }
            ))

            // Remplir les abscences de tous ceux qui ne sont pas venu...
            await prisma.absence.createMany({
                data: abscencesData
            });

            // Mettre a jour les status pour la journée qui arrivent
            await prisma.employee.updateMany({
                where: {
                    deletedAt: null,
                    isComeAndBack: true
                },
                data: {
                    isComeAndBack: false
                }
            })
        });

        log.info('Employee status updated !');
    } catch (error) {
        throwError('Failed to update employee status', error)
    }
}

export default updateStatusEmployee;