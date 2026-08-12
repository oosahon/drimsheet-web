import { describe, expect, it } from 'vitest';
import { isInflowFormExchangeRateRequired } from './is-inflow-form-exchange-rate-required.helper';

describe('isInflowFormExchangeRateRequired', () => {
  it('requires an exchange rate for different source and functional currencies', () => {
    expect(isInflowFormExchangeRateRequired('USD', 'NGN')).toBe(true);
  });

  it('does not require an exchange rate for matching currencies', () => {
    expect(isInflowFormExchangeRateRequired('NGN', 'NGN')).toBe(false);
  });

  it.each([
    [undefined, 'NGN'],
    ['USD', undefined],
    ['', 'NGN'],
  ])(
    'does not require an exchange rate when a currency is missing',
    (sourceCurrencyCode, functionalCurrencyCode) => {
      expect(
        isInflowFormExchangeRateRequired(
          sourceCurrencyCode,
          functionalCurrencyCode
        )
      ).toBe(false);
    }
  );
});
