import readline from 'readline-sync';
import chalk from 'chalk';
import { logger } from '../logger/logger.js';
import { performConversion } from '../services/currency.js';

export async function mainMenu(appState) {
    while (true) {
        console.clear();
        logger.info('\n=== Convertidor de Divisas ===');
        console.log(chalk.magenta('1. Mostrar monedas disponibles'));
        console.log(chalk.magenta('2. Mostrar tasas de cambio actuales'));
        console.log(chalk.magenta('3. Realizar conversion'));
        console.log(chalk.magenta('4. Ver historial de conversiones'));
        console.log(chalk.magenta('5. Salir\n'));

        const option = readline.question('Seleccione una opcion: ');

        switch (option) {
            case '1':
                console.log('Monedas disponibles:', appState.availableCurrencies.join(', '));
                break;
            case '2':
                console.log('Tasas de cambio actuales:', appState.exchangeRates);
                break;
            case '3':
                await handleConversion(appState);
                break;
            case '4':
                showHistory(appState);
                break;
            case '5':
                process.exit(0);
            default:
                logger.error('Opcion no valida');
        }

        readline.question('\nPresione Enter para continuar...');
    }
}

async function handleConversion(appState) {
    const amount = parseFloat(readline.question('Ingrese la cantidad a convertir: '));
    const from = readline.question('Ingrese la moneda de origen (ej. USD): ').toUpperCase();
    const to = readline.question('Ingrese la moneda de destino (ej. EUR): ').toUpperCase();

    const result = await performConversion(amount, from, to, appState);
    if (result !== null) {
        logger.success(`${amount} ${from} = ${result} ${to}`);
    }
}

function showHistory(appState) {
    if (appState.history.length === 0) {
        logger.info('No hay conversiones en el historial.');
    } else {
        console.log('Historial de conversiones:');
        appState.history.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.amount} ${entry.from} -> ${entry.result} ${entry.to} (${entry.timestamp})`);
        });
    }
}