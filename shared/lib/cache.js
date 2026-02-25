import { LRUCache } from "lru-cache";


export function createCache({ max = 500, ttl = 60_000 } = {}) {
    return new LRUCache({ max, ttl });
}

export function invalidateWhere(cache, predicate) {
    for (const key of cache.keys()) {
        if (predicate(key)) {
            cache.delete(key);
        }
    }
}

// Re-export LRUCache for direct usage if needed
export { LRUCache };
