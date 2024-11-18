import { envs } from "@src/core/config/env";
import { localCache, redisClient } from "./redisClient";
import log from "@src/core/config/logger";
import zlib from 'zlib'

/**
* generic function to help saving and fetch data from cache redis and lru-cache to optimize performance
* @params cacheKey est la clé permettant de stocker une données dans le cache redis
* @params fetchFn la fonction a executer si les données ne sont pans dans le cache
* @params ttl pour la confiuration du temps normal d'expiration d'une data dans redis
* @returns Données récupérées depuis le cache ou après exécution de `fetchFn`
*/

type CacheableData = string | number | object;

const cacheData = async <T extends CacheableData>(cacheKey: string, fetchFn: () => Promise<T>, ttl: number = 900): Promise<T> => {
    //? Validate input and trow error
    if (!cacheKey || typeof cacheKey !== 'string') throw new Error("Invalid cache key provided.");
    if (typeof fetchFn !== 'function') throw new Error("fetchFn must be a function.");
    if (!Number.isInteger(ttl) || ttl <= 0) throw new Error("TTL must be a positive integer.");

    //? Fetch data from a localcash
    const cachedDataLocal = localCache.get(cacheKey);
    if (cachedDataLocal) {
        log.info(`data fetching from localCache at the key: ${cacheKey}`)

        return cachedDataLocal as T;
    }

    try {
        // & Fetch data from redis 
        const cachedDataRedis = await redisClient.get(cacheKey);

        // & check if redis has data and return it
        if (cachedDataRedis) {
            try {
                log.info(`data fetching from redis at the key: ${cacheKey}`)

                // Decompress dcachedDataRedisata if necessary
                let data: T;
                if (cachedDataRedis.startsWith('c')) {
                    const decompressedData = zlib.inflateSync(Buffer.from(cachedDataRedis.slice(1), 'base64')).toString();
                    data = JSON.parse(decompressedData) as T;
                } else {
                    data = JSON.parse(cachedDataRedis) as T;
                }

                localCache.set(cacheKey, data); // Updating local cache
                return data;

            } catch (error) {
                log.warn(`Failed to decompress or parse Redis data: ${error} !, fetching new data...`);
                await redisClient.del(cacheKey);
            }
        }

        // & if data are not in the cache, execute the function
        log.info("data are not in the cache, execution of the function...");
        const startTime = Date.now();

        const data = await fetchFn();

        log.info(`fetchFn executed in ${Date.now() - startTime}ms.`); // 

        // & Set fetching data inside redis and localcach
        const serializedData = JSON.stringify(data);
        let dataToStore: string;

        //* Compress data only if size is greater than 1Ko
        if (Buffer.byteLength(serializedData) > envs.COMPRESSION_THRESHOLD) {
            const compressData = zlib.deflateSync(serializedData).toString('base64');
            dataToStore = `c${compressData}` // Add c caracter for compress data
        } else {
            dataToStore = serializedData;
        }

        localCache.set(cacheKey, data);
        await redisClient.setex(cacheKey, ttl, dataToStore);

        log.info(`data fetching, saved in the cache with TTL: ${ttl} and in the localcache under the key: ${cacheKey}...`);

        // & return data if all is done...
        return data
    } catch (error) {
        const messageError = `Failed to manage cache for key: ${cacheKey}. Error: ${error instanceof Error ? error.message : JSON.stringify(error)}`

        log.error(messageError);
        throw new Error(messageError);
    }
}

export default cacheData