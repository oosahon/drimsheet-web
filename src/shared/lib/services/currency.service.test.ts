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
