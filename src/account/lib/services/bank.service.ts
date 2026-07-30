import { purpleLedgerApi } from '@/shared/lib/api';

export const bankService = {
  async getBanksByCountry(countryCode: string) {
    const response = await purpleLedgerApi.banks.getBanks({ countryCode });
    return response.data;
  },
};
