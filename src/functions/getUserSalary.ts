import {
    DAYS_OF_WORKS,
    HOURS_OF_WORKS,
    MIN_SALARY,
    SALARY_ROUND_FACTOR
} from "@src/core/constant";


export const reductionAmount = (
    baseSalary: number,
    abscencesHours: number
): number => {
    const hourlySalary = baseSalary / (HOURS_OF_WORKS * DAYS_OF_WORKS);
    const reduction = hourlySalary * abscencesHours;

    return reduction;
}

export const newSalary = (
    baseSalary: number,
    abscencesHours: number,
    Bonus: number = 0
): number => {
    const reduction = reductionAmount(baseSalary, abscencesHours);

    const salary = Math.max(
        Math.round((baseSalary - reduction + Bonus) / SALARY_ROUND_FACTOR) * SALARY_ROUND_FACTOR,
        MIN_SALARY
    );

    return salary
}

