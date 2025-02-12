const { convertCurrency, isValidCurrency, fetchExchangeRates, appState, isCacheExpired, addToHistory } = require('./index');

beforeAll(() => {
  global.console = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn()
  };

  jest.spyOn(process, 'exit').mockImplementation(() => {});
});

describe('Pruebas del Convertidor de Monedas', () => {
  beforeAll(() => {
    // En este test se simula la obtencion de tasas de cambio antes de las pruebas
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

  test('Devolver null si una moneda no es valida', () => {
    expect(convertCurrency(100, 'XYZ', 'USD')).toBeNull();
  });

  test('Verificar que una moneda es valida', () => {
    expect(isValidCurrency('USD')).toBe(true);
    expect(isValidCurrency('EUR')).toBe(true);
    expect(isValidCurrency('XYZ')).toBe(false);
  });

  test('Detectar si la cache esta expirada', () => {
    // En este test simulo un estado en el que la cache sigue valida
    appState.lastUpdated = Date.now();
    expect(isCacheExpired()).toBe(false);

    // Aqui se simula un estado en el que la cache ya expiro
    appState.lastUpdated = Date.now() - (10 * 60 * 1000);
    expect(isCacheExpired()).toBe(true);
  });

  test('Se agregan correctamente elementos al historial de conversiones', () => {
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

  test('El historial mantiene el limite de conversiones', () => {
    appState.history = [];
    for (let i = 0; i < 55; i++) {
      addToHistory({ amount: i, from: 'USD', to: 'EUR', result: i * 0.85 });
    }

    expect(appState.history.length).toBeLessThanOrEqual(50);
  });
});