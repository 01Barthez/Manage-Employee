import redis from "./redisClient";
import log from "@src/core/config/logger";
import { LRUCache } from 'lru-cache'

const localCache = new LRUCache({
    max: 100,
    ttl: 60 * 1000
})

const cacheData = async <T>(
    cashKey: string,
    fetchFn: () => Promise<T>,
    ttl: number
): Promise<T> => {
    try {
        // & Fetc data from redis 
        const cashData = await redis.get(cashKey);

        // & check if redis has data and return it
        if (cashData) {
            localCache.set(cashKey, cashData); // Updating
            return JSON.parse(cashData) as T;
        }

        // &
        const data = await fetchFn();

        // & Set fetcing data inside redis and localcach
        if (data) {
            localCache.set(cashKey, data);
            await redis.setex(cashKey, ttl, JSON.stringify(data));
        }

        // &
        return data
    } catch (error) {
        const messageError = `Failed to Manage cash: ${error && (error instanceof Error ? error.message : JSON.stringify(error))}`
        log.error(messageError);
        throw new Error(messageError);
    }
}

export default cacheData