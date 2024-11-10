import log from '@src/core/config/logger';
import throwError from '@src/utils/errors/throwError';
import blackListToken from '@src/utils/helpers/blackListToken';
import { CronJob } from 'cron';

const deleteExpiredTokens = new CronJob(
    '0 0 0 * * *', // tous les jours a minuit
    async () => {
        try {
            blackListToken.removeExpiredTpken();
            log.info('deleting expired token...');                
        } catch (error) {
            throwError(`Erreur lors de la suppression des token expirés`, error);
        }
    },
    null,
    true,
);

export default deleteExpiredTokens