import { logger } from '../logger/logger.js';

export function handleApiError(error, context) {
    let errorMessage = context;
    if (error.response) {
        errorMessage += ` [${error.response.status}]: ${error.response.data.message}`;
    } else {
        errorMessage += `: ${error.message}`;
    }
    logger.error(errorMessage);
}