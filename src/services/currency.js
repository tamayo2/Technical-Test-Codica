import { apiClient } from '../api/apiClient.js';
import { logger } from '../logger/logger.js';
import { handleApiError } from '../utils/errorHandler.js';
import { isCacheExpired } from '../utils/validation.js';
import { addToHistory } from './history.js';

export async function getExchangeRates(baseCurrency) {
    try {
        const response = await apiClient.get('latest', { params: { base_currency: baseCurrency } });
        return response.data.data;
    } catch (error) {
        throw new Error(handleApiError(error, 'Error obteniendo tasas de cambio'));
    }
}

export async function getAvailableCurrencies() {
    try {
        const response = await apiClient.get('currencies');
        return Object.keys(response.data.data);
    } catch (error) {
        throw new Error(handleApiError(error, 'Error cargando monedas disponibles'));
    }
}

export async function updateExchangeRates(appState) {
    try {
        appState.exchangeRates = await getExchangeRates(appState.baseCurrency);
        appState.lastUpdated = Date.now();

        if (appState.availableCurrencies.length === 0) {
            appState.availableCurrencies = await getAvailableCurrencies();
        }

        logger.success('Tasas de cambio actualizadas correctamente');
    } catch (error) {
        throw new Error(handleApiError(error, 'Error actualizando tasas de cambio'));
    }
}

export function convertCurrency(amount, from, to, exchangeRates) {
    if (!exchangeRates[from] || !exchangeRates[to]) {
        throw new Error('Moneda(s) no valida(s)');
    }
    return (amount / exchangeRates[from]) * exchangeRates[to];
}

export async function performConversion(amount, from, to, appState) {
    try {
        if (isCacheExpired(appState.lastUpdated)) {
            logger.warning('Las tasas están desactualizadas, actualizando...');
            await updateExchangeRates(appState);
        }

        const result = convertCurrency(amount, from, to, appState.exchangeRates);
        appState.history = addToHistory(appState.history, { amount, from, to, result });

        return result;
    } catch (error) {
        logger.error(`Error en la conversion: ${error.message}`);
        return null;
    }
}