import ledgerAccountService from '@/ledger-accounts/services/ledger-account.service';
import { type IGetLedgerAccountsQuery } from '@/shared/utils/api/Api';
import { useQuery } from '@tanstack/react-query';

export default function useLedgerAccounts(query: IGetLedgerAccountsQuery) {
  return useQuery({
    queryKey: ['ledgerAccountService.getLedgerAccounts', query],
    queryFn: () => ledgerAccountService.getLedgerAccounts(query),
  });
}
