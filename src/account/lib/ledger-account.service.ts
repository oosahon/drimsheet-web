import purpleLedgerApi from '@/shared/utils/api';
import {
  ELedgerAccountSubType,
  ELedgerType,
  type IGetLedgerAccountsQuery,
} from '@/shared/utils/api/Api';

async function getLedgerAccounts(query: IGetLedgerAccountsQuery) {
  const response = await purpleLedgerApi.ledger.getLedgerAccounts(query);
  return response.data;
}

function getPettyBaseCashFilters(): IGetLedgerAccountsQuery {
  return {
    type: ELedgerType.Asset,
    subType: ELedgerAccountSubType.CashAndCashEquivalent,
    behavior: 'petty_cash',
  };
}

async function getLedgerAccount(id: string) {
  const res = await purpleLedgerApi.ledger.getLedgerAccount(id);
  return res.data;
}

const ledgerAccountService = Object.freeze({
  getLedgerAccounts,
  getPettyBaseCashFilters,
  getLedgerAccount,
});

export default ledgerAccountService;
