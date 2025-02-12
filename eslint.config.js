const globals = require('globals');
const pluginJs = require('@eslint/js');

module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.jest } // ⬅️ Agregar soporte para Jest
    },
    rules: {
      'camelcase': 'error',
      'no-console': 'off',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'indent': ['error', 2],
      'eqeqeq': 'error',
      'no-unused-vars': 'warn' // ⬅️ Cambiar de "error" a "warn" para evitar romper la ejecución por variables sin usar
    }
  },
  pluginJs.configs.recommended
];
