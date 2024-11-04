import log from '@src/core/config/logger';
import DeleteUnverified from '@src/functions/deleteUnverifiedUser';
import {CronJob} from 'cron';

const deleteInvalidUser = new CronJob (
    '0 0 0 * * *', // cronTime
	async() => {
		DeleteUnverified();
        log.info('Not verified user deleted !');
	},
	null, // onComplete
	true, // start
);

export default deleteInvalidUser