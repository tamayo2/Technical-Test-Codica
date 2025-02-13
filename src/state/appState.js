import { CONFIG } from '../config/config.js';

export const appState = {
    exchangeRates: {},
    lastUpdated: null,
    baseCurrency: CONFIG.DEFAULT_BASE_CURRENCY,
    history: [],
    availableCurrencies: []
};