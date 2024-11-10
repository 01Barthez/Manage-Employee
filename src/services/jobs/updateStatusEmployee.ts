import log from '@src/core/config/logger';
import { holidays } from '@src/core/constant';
import updateStatusEmployee from '@src/functions/updateEmployeeStatus';
import {CronJob} from 'cron';

const isHolidays = (): boolean => {
	const today = new Date();
	const dateOdTodayFormatted = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}`;
	
	log.info(`date of today formated: ${dateOdTodayFormatted}`);

	return holidays.includes(dateOdTodayFormatted);
}

const updateEmployeeStatus = new CronJob (
    '0 0 0 * * 1-6', // Du lundi au samedi au minuit
	async() => {
		try {
			log.info('updating employee status...');                
			if(!isHolidays()) {
				updateStatusEmployee();
				log.info('ce n\'est pas un Jour férié on mets a jours !');			
			}
		} catch (error) {
            throw new Error(`Fail to update employees status: ${error}`);
		}
	},
	null, // onComplete
	true, // start
);

export default updateEmployeeStatus