import log from '@src/core/config/logger';
import blackListToken from '@src/utils/helpers/blackListToken';
import { CronJob } from 'cron';

const deleteExpiredTokens = new CronJob(
    '0 0 0 * * *', // tous les jours a minuit
    async () => {
        try {
            blackListToken.removeExpiredTpken();
            log.info('deleting expired token...');                
        } catch (error) {
            throw new Error(`Failed to deleted expired token: ${error}`);
        }
    },
    null,
    true,
);

export default deleteExpiredTokens