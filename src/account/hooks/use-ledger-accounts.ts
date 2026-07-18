import ledgerAccountService from '@/account/lib/ledger-account.service';
import { type IGetLedgerAccountsQuery } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

export default function useLedgerAccounts(query: IGetLedgerAccountsQuery) {
  return useQuery({
    queryKey: ['ledgerAccountService.getLedgerAccounts', query],
    queryFn: () => ledgerAccountService.getLedgerAccounts(query),
  });
}
