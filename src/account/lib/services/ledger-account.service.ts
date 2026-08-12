import { purpleLedgerApi } from '@/shared/lib/api';
import {
  ELedgerAccountSubType,
  ELedgerType,
  type IGetLedgerAccountsQuery,
  type IGetPermittedPostingAccountsQuery,
} from '@/shared/lib/api/Api';

async function getLedgerAccounts(query: IGetLedgerAccountsQuery) {
  const response = await purpleLedgerApi.ledger.getLedgerAccounts(query);
  return response.data;
}

function getPettyBaseCashFilters(): IGetLedgerAccountsQuery {
  return {
    type: ELedgerType.Asset,
    subType: ELedgerAccountSubType.CashAndCashEquivalent,
    isControlAccount: false,
  };
}

async function getLedgerAccount(id: string) {
  const res = await purpleLedgerApi.ledger.getLedgerAccount(id);
  return res.data;
}

async function getPermittedPostingAccounts(
  query: IGetPermittedPostingAccountsQuery
) {
  const res = await purpleLedgerApi.ledger.getPermittedPostingAccounts(query);
  return res.data;
}

export const ledgerAccountService = Object.freeze({
  getLedgerAccounts,
  getPettyBaseCashFilters,
  getLedgerAccount,
  getPermittedPostingAccounts,
});
