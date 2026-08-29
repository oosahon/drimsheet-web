import countries from '@/shared/configs/countries.json' with { type: 'json' };
import { drimsheetApi } from '@/shared/lib/api';
import type { IExchangeRateQueryParam } from '@/shared/lib/api/Api';

export const currencyService = {
  async getAll() {
    const res = await drimsheetApi.currencies.getAllCurrencies();
    return res.data;
  },

  async getExchangeRates(query: IExchangeRateQueryParam) {
    const res = await drimsheetApi.currencies.getExchangeRates(query);
    return res.data;
  },

  getJurisdictionLocale(currencyCode: string) {
    const jurisdiction = countries.find(
      (country) => country.currencyCode === currencyCode
    );
    return jurisdiction?.locale ?? 'en-NG';
  },
};
