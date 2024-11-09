import { MAX_END_HOURS } from "@src/core/constant";

const today = new Date();

export const roundedTime = () => {
    let hours = today.getHours();
    let minutes = today.getMinutes();

    if (minutes >= 45) {
        hours += 1;
        minutes = 0;
    } else if (minutes >= 20) {
        minutes = 30;
    } else {
        minutes = 0;
    }

    hours = Math.min(hours, MAX_END_HOURS);

    return { hours, minutes }
}

export const roundHours = (
    endingHours: number, 
    endingMinutes: number, 
    beginMinutes: number
): number => {
    const totalMinutes = endingMinutes + beginMinutes;
    if (totalMinutes === 30) return endingHours + 0.5
    if (totalMinutes === 60) return endingHours + 1
    
    return endingHours;
}
