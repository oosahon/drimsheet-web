import { drimsheetApi } from '@/shared/lib/api';
import {
  EExchangeRateType,
  type IExchangeRate,
  type IExchangeRateQueryParam,
} from '@/shared/lib/api/Api';
import { currencyService } from '@/shared/lib/services/currency.service';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/shared/lib/api', () => ({
  drimsheetApi: {
    currencies: {
      getAllCurrencies: vi.fn(),
      getExchangeRates: vi.fn(),
    },
  },
}));

const query = {
  currencyPair: 'USD/NGN',
  type: EExchangeRateType.Official,
  asOf: '2026-08-10',
  limit: 1,
} satisfies IExchangeRateQueryParam;

const officialRate = {
  currencyPair: 'USD/NGN',
  baseCurrencyCode: 'USD',
  targetCurrencyCode: 'NGN',
  rate: 1500,
  type: EExchangeRateType.Official,
  asOf: '2026-08-10T00:00:00.000Z',
  source: 'central-bank',
  createdAt: '2026-08-10T01:00:00.000Z',
} satisfies IExchangeRate;

describe('currencyService', () => {
  beforeEach(() => vi.clearAllMocks());

  it('inverts a positive finite rate', () => {
    expect(currencyService.invertRate(1000)).toBe(0.001);
    expect(currencyService.invertRate('0.001')).toBe(1000);
  });

  it('round-trips a representative reciprocal within numeric precision', () => {
    const invertedRate = currencyService.invertRate(1500);

    expect(invertedRate).toBeDefined();
    expect(currencyService.invertRate(invertedRate!)).toBeCloseTo(1500);
  });

  it.each([undefined, '', 0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    'does not invert an invalid rate: %s',
    (rate) => {
      expect(currencyService.invertRate(rate)).toBeUndefined();
    }
  );

  it('forwards an exchange-rate query and returns the response data', async () => {
    vi.mocked(drimsheetApi.currencies.getExchangeRates).mockResolvedValue({
      data: [officialRate],
    } as never);

    await expect(currencyService.getExchangeRates(query)).resolves.toEqual([
      officialRate,
    ]);
    expect(drimsheetApi.currencies.getExchangeRates).toHaveBeenCalledWith(
      query
    );
  });
});
