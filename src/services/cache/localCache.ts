import { envs } from '@src/core/config/env';
import { LRUCache } from 'lru-cache'

// setup a local cache
const localCache = new LRUCache({
    max: envs.LOCAL_CACHE_MAX_ITEMS || 100,
    ttl: 60 * 1000 * 2, // 2 minutes
})

export default localCache;