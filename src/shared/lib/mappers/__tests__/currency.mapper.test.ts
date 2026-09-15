import { EExchangeRateType } from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/mappers/currency.mapper';
import { describe, expect, it } from 'vitest';

describe('currencyMapper', () => {
  it('maps a user-entered rate to the API exchange-rate contract', () => {
    expect(
      currencyMapper.toUserEnteredExchangeRate({
        baseCurrencyCode: 'USD',
        targetCurrencyCode: 'NGN',
        rate: 1500,
        asOf: '2026-07-01',
      })
    ).toEqual({
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1500,
      asOf: '2026-07-01',
      type: EExchangeRateType.Market,
      source: 'manual',
    });
  });

  it('rejects incompatible pairs and invalid payload rates', () => {
    expect(() =>
      currencyMapper.toUserEnteredExchangeRate(
        {
          baseCurrencyCode: 'USD',
          targetCurrencyCode: 'NGN',
          rate: 1,
          asOf: '2026-07-01',
        },
        { baseCurrencyCode: 'EUR', targetCurrencyCode: 'GBP' }
      )
    ).toThrow('Exchange rate currency pair is incompatible');
    expect(() =>
      currencyMapper.toUserEnteredExchangeRate({
        baseCurrencyCode: 'USD',
        targetCurrencyCode: 'NGN',
        rate: 0,
        asOf: '2026-07-01',
      })
    ).toThrow('Exchange rate must be a positive finite number');
  });

  it('builds a canonical DTO from a reversed entered pair', () => {
    expect(
      currencyMapper.toUserEnteredExchangeRate(
        {
          baseCurrencyCode: 'USD',
          targetCurrencyCode: 'NGN',
          rate: 0.001,
          asOf: '2026-07-01',
        },
        { baseCurrencyCode: 'NGN', targetCurrencyCode: 'USD' }
      )
    ).toEqual({
      baseCurrencyCode: 'USD',
      targetCurrencyCode: 'NGN',
      rate: 1000,
      asOf: '2026-07-01',
      type: EExchangeRateType.Market,
      source: 'manual',
    });
  });
});
