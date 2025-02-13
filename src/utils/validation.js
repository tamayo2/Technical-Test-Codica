import { appState } from '../state/appState.js';
import { CONFIG } from '../config/config.js';

export function isValidCurrency(currency) {
    return appState.availableCurrencies.includes(currency);
}

export function isCacheExpired() {
    return (
        !appState.lastUpdated ||
        Date.now() - appState.lastUpdated > CONFIG.CACHE_TTL
    );
}