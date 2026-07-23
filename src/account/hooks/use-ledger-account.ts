import { ledgerAccountService } from '@/account/lib/ledger-account.service';
import { useQuery } from '@tanstack/react-query';

export function useLedgerAccount(id?: string) {
  return useQuery({
    queryKey: ['ledgerAccountService.getLedgerAccount', id],
    queryFn: () => (id ? ledgerAccountService.getLedgerAccount(id) : undefined),
    enabled: !!id,
  });
}
