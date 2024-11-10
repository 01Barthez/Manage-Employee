import { envs } from '@src/core/config/env';
import log from '@src/core/config/logger';
import throwError from '@src/utils/errors/throwError';
import Redis from 'ioredis'


// Create instance of redis
const redis = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
    db: 0,
    lazyConnect: true,
    connectTimeout: 10000,
    maxRetriesPerRequest: 5,
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay
    },
});

// Handle error
redis.on('error', (error) => {
    throwError("Redis meet some error, verify your network connection: ", error)
})

// success connection
redis.on('connect', ()=> {
    log.info('success connection to Redis');
})

redis.on('reconnecting', (time) => {
    log.warn(`reconnexion to redis in ${time} ms ...`)
})

export default redis