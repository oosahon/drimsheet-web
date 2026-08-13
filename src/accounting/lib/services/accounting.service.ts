import { purpleLedgerApi } from '@/shared/lib/api';
import type { IAccountingEntityCreationDto } from '@/shared/lib/api/Api';
import { localStorageService } from '@/shared/lib/services/local-storage.service';

export const accountingService = {
  async getAccountingEntities() {
    const res = await purpleLedgerApi.accounting.getUserAccountingEntities();
    localStorageService.setAccountingEntityId(res.data[0]?.id ?? '');
    return res.data;
  },

  async getAccountingEntity() {
    const res = await purpleLedgerApi.accounting.getActiveAccountingEntity();
    return res.data;
  },

  async getJurisdiction() {
    const res = await purpleLedgerApi.accounting.getJurisdictions();
    return res.data;
  },

  async createAccountingEntity(payload: IAccountingEntityCreationDto) {
    const { data } =
      await purpleLedgerApi.accounting.createAccountingEntity(payload);

    localStorageService.setAccountingEntityId(data.id);
    return data;
  },
};
