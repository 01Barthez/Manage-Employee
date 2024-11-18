import { envs } from '@src/core/config/env';
import log from '@src/core/config/logger';
import Redis from 'ioredis'
import { LRUCache } from 'lru-cache'

// setup a local cache
const localCache = new LRUCache({
    max: envs.LOCAL_CACHE_MAX_ITEMS || 100,
    ttl: 60 * 1000 * 2, // 2 minutes
})

// Create instance of redis
const redisClient = new Redis({
    host: envs.REDIS_HOST,
    port: envs.REDIS_PORT,
    password: envs.REDIS_PASSWORD || undefined,
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

export {redisClient, localCache}