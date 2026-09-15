import currencyExchangeRateInputHelpers from '@/shared/components/currency-exchange-rate-input/helper';
import { describe, expect, it } from 'vitest';

const officialRate = 1500;

describe('currencyExchangeRateInputHelpers', () => {
  describe('getValue', () => {
    it('preserves an explicit input value', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue(1600, officialRate)
      ).toBe(1600);
    });

    it('uses the official rate when the input value is empty', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue(undefined, officialRate)
      ).toBe(1500);
    });

    it('returns undefined when no value source is present', () => {
      expect(
        currencyExchangeRateInputHelpers.getValue(undefined, undefined)
      ).toBeUndefined();
    });
  });
});
