import { ledgerAccountService } from '@/account/lib/services/ledger-account.service';
import { type IGetLedgerAccountsQuery } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

export function useLedgerAccounts(query: IGetLedgerAccountsQuery) {
  return useQuery({
    queryKey: ['ledgerAccountService.getLedgerAccounts', query],
    queryFn: () => ledgerAccountService.getLedgerAccounts(query),
  });
}
