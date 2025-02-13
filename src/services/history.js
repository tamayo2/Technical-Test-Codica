import { CONFIG } from '../config/config.js';
import { appState } from '../state/appState.js';

export function addToHistory(entry) {
    if (appState.history.length >= CONFIG.HISTORY_LIMIT) {
        appState.history.shift();
    }
    appState.history.push({
        ...entry,
        timestamp: new Date().toISOString()
    });
}