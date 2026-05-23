import countries from '@/shared/config/countries.json' with { type: 'json' };
import purpleLedgerApi from '@/shared/utils/api';

const currencyService = {
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

export default currencyService;
