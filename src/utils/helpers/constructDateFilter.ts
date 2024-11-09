import * as datefns from 'date-fns'

const DateFilter = (day?: string, month?: string, year?: string): Date | undefined => {
    const now = new Date();
    let dateFilter = datefns.startOfDay(now);

    dateFilter = datefns.startOfDay(now); // set to midnight
    if (day) {
        // define date of the day
        dateFilter = datefns.setDay(dateFilter, Number(day) - 1);
    }
    if (month) {
        // define date of the month
        dateFilter = datefns.setMonth(dateFilter, Number(month) - 1);
    }
    if (year) {
        // define date of the year
        dateFilter = datefns.setYear(dateFilter, Number(year));
    }

    return dateFilter;
};

export default DateFilter