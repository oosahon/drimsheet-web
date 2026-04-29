import localStorageService from '@/shared/services/local-storage.service';
import purpleLedgerApi from '@/shared/utils/api';

const accountingService = {
  async getAccountingEntities() {
    const res = await purpleLedgerApi.accounting.getUserAccountingEntities();
    localStorageService.setAccountingEntityId(res.data[0]?.id ?? '');
    return res.data;
  },

  async getJurisdiction() {
    const res = await purpleLedgerApi.accounting.getJurisdictions();
    return res.data;
  },
};

export default accountingService;
