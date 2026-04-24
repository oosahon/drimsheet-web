import localStorageService from '@/shared/services/local-storage.service';
import purpleLedgerApi from '@/shared/utils/api';

const accountingEntityService = {
  async getAll() {
    const res = await purpleLedgerApi.accountingEntities.getAll();
    localStorageService.setAccountingEntityId(res.data[0]?.id ?? '');
    return res.data;
  },
};

export default accountingEntityService;
