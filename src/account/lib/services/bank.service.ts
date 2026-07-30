import { purpleLedgerApi } from '@/shared/lib/api';

export const bankService = {
  async getBanksByCountry(countryCode: string) {
    return purpleLedgerApi.banks.getBanks({ countryCode });
  },
};
