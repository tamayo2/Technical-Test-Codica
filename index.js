require('dotenv').config();
const axios = require('axios');
const readline = require('readline-sync');
const chalk = require('chalk');

// Configuración centralizada
const CONFIG = {
  API_KEY: process.env.API_KEY || null,
  BASE_API_URL: 'https://api.freecurrencyapi.com/v1/',
  CACHE_TTL: 5 * 60 * 1000, // 5 minutos en milisegundos
  HISTORY_LIMIT: 50,
  DEFAULT_BASE_CURRENCY: 'USD'
};

// Validación temprana de configuración
if (!CONFIG.API_KEY) {
  console.error(chalk.red('❌ ERROR: API_KEY no configurada en variables de entorno'));

  // 🔹 Evitar que process.exit(1) afecte Jest
  if (process.env.JEST_WORKER_ID === undefined) {
    process.exit(1);
  }
}

// Estado de la aplicación
const appState = {
  exchangeRates: {},
  lastUpdated: null,
  baseCurrency: CONFIG.DEFAULT_BASE_CURRENCY,
  history: [],
  availableCurrencies: []
};

// Utilidades de logging
const logger = {
  error: (message) => console.error(chalk.red(`❌ ${message}`)),
  success: (message) => console.log(chalk.green(`✔ ${message}`)),
  info: (message) => console.log(chalk.blue(`ℹ ${message}`)),
  warning: (message) => console.log(chalk.yellow(`⚠ ${message}`)),
};

// Manejo de la API
const apiClient = axios.create({
  baseURL: CONFIG.BASE_API_URL,
  timeout: 5000,
  params: { apikey: CONFIG.API_KEY }
});

async function fetchExchangeRates(baseCurrency = CONFIG.DEFAULT_BASE_CURRENCY) {
  try {
    const response = await apiClient.get('latest', {
      params: { base_currency: baseCurrency }
    });

    appState.exchangeRates = response.data.data;
    appState.baseCurrency = baseCurrency;
    appState.lastUpdated = Date.now();
    logger.success('Tasas de cambio actualizadas correctamente');

    // Actualizar lista de monedas disponibles
    if (appState.availableCurrencies.length === 0) {
      const currenciesResponse = await apiClient.get('currencies');
      appState.availableCurrencies = Object.keys(currenciesResponse.data.data);
    }
  } catch (error) {
    handleApiError(error, 'Error obteniendo tasas de cambio');
  }
}

function handleApiError(error, context) {
  let errorMessage = context;
  if (error.response) {
    errorMessage += ` [${error.response.status}]: ${error.response.data.message}`;
  } else {
    errorMessage += `: ${error.message}`;
  }
  logger.error(errorMessage);
}

function convertCurrency(amount, from, to) {
  if (!isValidCurrency(from) || !isValidCurrency(to)) {
    logger.error('Moneda(s) no válida(s)');
    return null;
  }

  if (isCacheExpired()) {
    logger.warning('Las tasas están desactualizadas, actualizando...');
    fetchExchangeRates(appState.baseCurrency);
  }

  const convertedAmount = (amount / appState.exchangeRates[from]) * appState.exchangeRates[to];
  return parseFloat(convertedAmount.toFixed(4));
}

function isValidCurrency(currency) {
  return appState.availableCurrencies.includes(currency);
}

function isCacheExpired() {
  return Date.now() - appState.lastUpdated > CONFIG.CACHE_TTL;
}

function addToHistory(entry) {
  if (appState.history.length >= CONFIG.HISTORY_LIMIT) {
    appState.history.shift();
  }
  appState.history.push({
    ...entry,
    timestamp: new Date().toISOString()
  });
}

// Exportar funciones para Jest
module.exports = {
  convertCurrency,
  isValidCurrency,
  fetchExchangeRates,
  appState,
  isCacheExpired,  // 🔹 Agregamos esta función
  addToHistory
};

// Inicialización de la aplicación
if (require.main === module) {
  (async () => {
    try {
      await fetchExchangeRates();

      console.clear();
      logger.info('\n=== Convertidor de Divisas ===');
      console.log(chalk.magenta('1. Mostrar monedas disponibles'));
      console.log(chalk.magenta('2. Mostrar tasas de cambio actuales'));
      console.log(chalk.magenta('3. Realizar conversión'));
      console.log(chalk.magenta('4. Ver historial de conversiones'));
      console.log(chalk.magenta('5. Salir\n'));

    } catch (error) {
      logger.error(`Error crítico: ${error.message}`);

      // 🔹 Evitar que process.exit(1) afecte Jest
      if (process.env.JEST_WORKER_ID === undefined) {
        process.exit(1);
      }
    }
  })();
}
