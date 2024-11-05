
import log from '@src/core/config/logger';
import sendEmployeeSalary from '@src/functions/sendEmployeeSalary';
import {CronJob} from 'cron';

const notifiedEmployeeSalary = new CronJob (
    '0 0 7 1 * *', // chaque 1er du mois à 7h00 
	async() => {
        try {
            sendEmployeeSalary();
            log.info('Notify employee in process... !');            
        } catch (error) {
            log.error(`Erreur lors de l'envoi de notification de salaire : ${error}`);
        }
	},
	null, // onComplete
	true, // start
);

export default notifiedEmployeeSalary