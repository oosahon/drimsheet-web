import purpleLedgerApi from '@/shared/utils/api';

const currencyService = {
  async getAll() {
    const res = await purpleLedgerApi.currencies.getAll();
    return res.data;
  },
};

export default currencyService;
