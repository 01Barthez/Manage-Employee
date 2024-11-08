import log from '@src/core/config/logger';
import DeleteUnverified from '@src/functions/deleteUnverifiedUser';
import throwError from '@src/utils/errors/throwError';
import {CronJob} from 'cron';

const deleteInvalidUser = new CronJob (
    '0 0 0 * * *', // chaque jour a minuit
	async() => {
		try {
			DeleteUnverified();
			log.info('Suppression des employé non vérifié suite a leur création...');			
		} catch (error) {
            throwError(`Erreur lors de la suppression employés non vérifiés`, error);
		}
	},
	null, // onComplete
	true, // start
);

export default deleteInvalidUser