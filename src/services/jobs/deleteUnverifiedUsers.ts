import usersControllers from '@src/controllers/users-controllers';
import log from '@src/core/config/logger';
import {CronJob} from 'cron';

const deleteInvalidUser = new CronJob (
    '0 0 0 * * *', // cronTime
	async() => {
		await usersControllers.DeleteUNVERIFIED();
        log.info('Not verified user deleted !');
	},
	null, // onComplete
	true, // start
);

export default deleteInvalidUser