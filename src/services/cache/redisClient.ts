import { envs } from '@src/core/config/env';
import log from '@src/core/config/logger';
import Redis from 'ioredis'

// Create instance of redis
const redisClient = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
    // username: envs.REDIS_USERNAME,
    // password: envs.REDIS_PASSWORD,
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
redisClient.on('error', (error) => {
    const msgError = `[Redis] Error when connecting to redis at ${envs.REDIS_HOST}:${envs.REDIS_PORT}: ${error}`;

    log.error(msgError);
    throw new Error(msgError);
})

// success connection
redisClient.on('connect', ()=> {
    log.info('[Redis] success connection to Redis');
})

// Status for reconnection to redis
redisClient.on('reconnecting', (time) => {
    log.warn(`[Redis] reconnexion to redis in ${time} ms ...`)
})

export default redisClient;