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
});
