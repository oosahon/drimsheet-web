import purpleLedgerApi from '@/shared/utils/api';

const accountingEntityService = {
  async getAll() {
    const res = await purpleLedgerApi.accountingEntities.getAll();
    return res.data;
  },
};

export default accountingEntityService;
