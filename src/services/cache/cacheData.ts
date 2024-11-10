import redis from "./redisClient";
import log from "@src/core/config/logger";


const cacheData = async <T>(
    cashKey: string, 
    fetchFn : () => Promise<T>, 
    ttl: number
): Promise<T> => {
    try {
        // &
        const cashData = await redis.get(cashKey);
        
        // &
        if(cashData) return JSON.parse(cashData) as T;
        
        // &
        const data = await fetchFn();

        // &
        await redis.setex(cashKey, ttl, JSON.stringify(data)); 

        // &
        return data
    } catch (error) {
        const messageError = `Failed to Manage cash: ${error && (error instanceof Error ? error.message : JSON.stringify(error))}`
        log.error(messageError);
        throw new Error(messageError);    }
}

export default cacheData