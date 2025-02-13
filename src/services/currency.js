import { apiClient } from '../api/apiClient.js';
import { appState } from '../state/appState.js';
import { logger } from '../logger/logger.js';
import { handleApiError } from '../utils/errorHandler.js';
import { isCacheExpired, isValidCurrency } from '../utils/validation.js';
import { CONFIG } from '../config/config.js';
import { addToHistory } from './history.js';

async function loadAvailableCurrencies() {
    try {
        const response = await apiClient.get('currencies');
        appState.availableCurrencies = Object.keys(response.data.data);
    } catch (error) {
        handleApiError(error, 'Error cargando monedas disponibles');
    }
}

export async function fetchExchangeRates(baseCurrency = CONFIG.DEFAULT_BASE_CURRENCY) {
    try {
        const response = await apiClient.get('latest', {
            params: { base_currency: baseCurrency }
        });

        appState.exchangeRates = response.data.data;
        appState.baseCurrency = baseCurrency;
        appState.lastUpdated = Date.now();

        if (appState.availableCurrencies.length === 0) {
            await loadAvailableCurrencies();
        }

        logger.success('Tasas de cambio actualizadas correctamente');
    } catch (error) {
        handleApiError(error, 'Error obteniendo tasas de cambio');
    }
}

export async function convertCurrency(amount, from, to) {
    try {
        if (!isValidCurrency(from) || !isValidCurrency(to)) {
            logger.error('Moneda(s) no valida(s)');
            return null;
        }

        if (isCacheExpired()) {
            logger.warning('Las tasas estan desactualizadas, actualizando...');
            await fetchExchangeRates(appState.baseCurrency);
        }

        const convertedAmount = (amount / appState.exchangeRates[from]) * appState.exchangeRates[to];
        const result = parseFloat(convertedAmount.toFixed(4));

        addToHistory({
            amount,
            from,
            to,
            result
        });

        return result;
    } catch (error) {
        logger.error(`Error en la conversion: ${error.message}`);
        return null;
    }
}