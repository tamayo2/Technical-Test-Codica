import 'dotenv/config';
import { mainMenu } from './ui/menu.js';
import { appState } from './state/appState.js';
import { logger } from './logger/logger.js';
import { handleApiError } from './utils/errorHandler.js';
import { updateExchangeRates } from './services/currency.js';

async function main() {
    try {
        await updateExchangeRates(appState);
        await mainMenu(appState);
    } catch (error) {
        logger.error(handleApiError(error, 'Error crítico'));
        process.exit(1);
    }
}

main();