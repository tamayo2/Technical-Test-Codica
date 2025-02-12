const { convertCurrency, isValidCurrency, fetchExchangeRates, appState, isCacheExpired, addToHistory } = require('./index');

// Mock de console.log y console.error para evitar errores en Jest
beforeAll(() => {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };

  // Mock de process.exit para que Jest no termine inesperadamente
  jest.spyOn(process, 'exit').mockImplementation(() => {});
});

describe('Pruebas del Convertidor de Monedas', () => {
  beforeAll(() => {
    // Simula la obtención de tasas de cambio antes de las pruebas
    appState.exchangeRates = {
      USD: 1,
      EUR: 0.85,
      JPY: 110.12
    };
    appState.availableCurrencies = ['USD', 'EUR', 'JPY'];
    appState.lastUpdated = Date.now();
  });

  test('Convierte correctamente USD a EUR', () => {
    const result = convertCurrency(100, 'USD', 'EUR');
    expect(result).toBeCloseTo(85.00, 2);
  });

  test('Convierte correctamente JPY a USD', () => {
    const result = convertCurrency(11012, 'JPY', 'USD');
    expect(result).toBeCloseTo(100, 2);
  });

  test('Devuelve null si una moneda no es válida', () => {
    expect(convertCurrency(100, 'XYZ', 'USD')).toBeNull();
  });

  test('Verifica que una moneda es válida', () => {
    expect(isValidCurrency('USD')).toBe(true);
    expect(isValidCurrency('EUR')).toBe(true);
    expect(isValidCurrency('XYZ')).toBe(false);
  });

  test('Detecta si la caché está expirada', () => {
    // Simula un estado en el que la caché sigue válida
    appState.lastUpdated = Date.now();
    expect(isCacheExpired()).toBe(false);

    // Simula un estado en el que la caché ya expiró
    appState.lastUpdated = Date.now() - (10 * 60 * 1000); // Hace 10 minutos
    expect(isCacheExpired()).toBe(true);
  });

  test('Agrega elementos al historial de conversiones', () => {
    // Simulamos una entrada de conversión
    const conversionEntry = {
      amount: 100,
      from: 'USD',
      to: 'EUR',
      result: 85
    };

    addToHistory(conversionEntry);

    expect(appState.history.length).toBe(1);
    expect(appState.history[0]).toMatchObject(conversionEntry);
  });

  test('El historial mantiene el límite de conversiones', () => {
    // Agregamos múltiples entradas para probar el límite
    appState.history = [];
    for (let i = 0; i < 55; i++) {
      addToHistory({ amount: i, from: 'USD', to: 'EUR', result: i * 0.85 });
    }

    expect(appState.history.length).toBeLessThanOrEqual(50); // HISTORY_LIMIT
  });
});