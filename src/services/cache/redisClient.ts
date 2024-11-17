import { envs } from '@src/core/config/env';
import log from '@src/core/config/logger';
import Redis from 'ioredis'


// Create instance of redis
const redisClient = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
    password: '',
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
    log.error(`Error when connecting to redis: ${error}`);
    throw new Error(`Redis meet some error, verify your network connection: ${error}`);
})

// success connection
redisClient.on('connect', ()=> {
    log.info('success connection to Redis');
})

// Status for reconnection to redis
redisClient.on('reconnecting', (time) => {
    log.warn(`reconnexion to redis in ${time} ms ...`)
})

export default redisClient