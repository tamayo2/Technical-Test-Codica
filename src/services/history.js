import { CONFIG } from '../config/config.js';

export function addToHistory(history, entry) {
    const newHistory = [...history];

    if (newHistory.length >= CONFIG.HISTORY_LIMIT) {
        newHistory.shift();
    }
    newHistory.push({
        ...entry,
        timestamp: new Date().toISOString()
    });

    return newHistory;
}