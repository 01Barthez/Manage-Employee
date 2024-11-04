import log from '@src/core/config/logger';
import blackListToken from '@src/functions/blackListToken';
import { CronJob } from 'cron';

const deleteExpiredTokens = new CronJob(
    '0 0 0 * * *', // tous les jours a minuit
    async () => {
        blackListToken.removeExpiredTpken();
        log.info('Not verified user deleted !');
    },
    null,
    true,
);

export default deleteExpiredTokens