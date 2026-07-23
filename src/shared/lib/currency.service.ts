import countries from '@/shared/configs/countries.json' with { type: 'json' };
import { purpleLedgerApi } from '@/shared/lib/api';

export const currencyService = {
  async getAll() {
    const res = await purpleLedgerApi.currencies.getAll();
    return res.data;
  },

  getJurisdictionLocale(currencyCode: string) {
    const jurisdiction = countries.find(
      (country) => country.currencyCode === currencyCode
    );
    return jurisdiction?.locale ?? 'en-NG';
  },
};
