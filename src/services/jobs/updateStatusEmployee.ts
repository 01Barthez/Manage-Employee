import log from '@src/core/config/logger';
import { holidays } from '@src/core/constant';
import updateEmployeeStatus from '@src/functions/updateEmployeeStatus';
import {CronJob} from 'cron';

const isHolidays = (): boolean => {
	const today = new Date();
	const dateOdTodayFormatted = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
	
	log.info(`date of today formated: ${dateOdTodayFormatted}`);

	return holidays.includes(dateOdTodayFormatted);
}

const updateEmployeeStatus = new CronJob (
    '0 0 0 * * 1-6', // cronTime
	async() => {
		if(!isHolidays()) {
			updateEmployeeStatus();
			log.info('Employee status updated !');
		}

		log.info('Jour férié on ne fait rien !');
	},
	null, // onComplete
	true, // start
);

export default updateEmployeeStatus