import chalk from 'chalk';

export const logger = {
    error: (message) => console.error(chalk.red(`❌ ${message}`)),
    success: (message) => console.log(chalk.green(`✔ ${message}`)),
    info: (message) => console.log(chalk.blue(`ℹ ${message}`)),
    warning: (message) => console.log(chalk.yellow(`⚠ ${message}`)),
};