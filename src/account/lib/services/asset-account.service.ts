import { purpleLedgerApi } from '@/shared/lib/api';
import type { IPettyCashAccountCreationReq } from '@/shared/lib/api/Api';

export const assetAccountService = {
  async createPettyCashAccount(payload: IPettyCashAccountCreationReq) {
    await purpleLedgerApi.ledger.createPettyCashAccount(payload);
  },
};
