export const CONFIG = Object.freeze({
    API_KEY: process.env.API_KEY || null,
    BASE_API_URL: 'https://api.freecurrencyapi.com/v1/',
    CACHE_TTL: 5 * 60 * 1000,
    HISTORY_LIMIT: 50,
    DEFAULT_BASE_CURRENCY: 'USD'
});