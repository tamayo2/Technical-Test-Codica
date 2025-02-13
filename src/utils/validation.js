import { CONFIG } from '../config/config.js';

export function isCacheExpired(lastUpdated) {
    return (
        !lastUpdated ||
        Date.now() - lastUpdated > CONFIG.CACHE_TTL
    );
}