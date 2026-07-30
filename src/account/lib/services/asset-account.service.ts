import { purpleLedgerApi } from '@/shared/lib/api';
import type {
  IBankAccountCreationReq,
  IPettyCashAccountCreationReq,
} from '@/shared/lib/api/Api';

export const assetAccountService = {
  async createPettyCashAccount(payload: IPettyCashAccountCreationReq) {
    await purpleLedgerApi.ledger.createPettyCashAccount(payload);
  },

  async createBankAccount(payload: IBankAccountCreationReq) {
    await purpleLedgerApi.accounts.createBankAccount(payload);
  },
};
