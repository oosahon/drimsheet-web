import type { IExchangeRate } from '@/shared/lib/api/Api';
import { describe, expect, it } from 'vitest';
import currencyExchangeRateInputHelpers from './currency-exchange-rate-input.helper';

const officialRate = { rate: 1500 } as IExchangeRate;

describe('currencyExchangeRateInputHelpers', () => {
  describe('getValue', () => {
    it('preserves an explicit input value', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue('1600', 1550, officialRate)
      ).toBe('1600');
    });

    it('uses the explicit default before the official rate', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue('', 1550, officialRate)
      ).toBe(1550);
    });

    it('uses the official rate when no value or default is present', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue('', undefined, officialRate)
      ).toBe(1500);
    });

    it('returns undefined when no value source is present', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue(
          undefined,
          undefined,
          undefined
        )
      ).toBeUndefined();
    });
  });
});
