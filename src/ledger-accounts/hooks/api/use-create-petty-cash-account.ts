import assetAccountService from '@/ledger-accounts/services/asset-account.service';
import type { IPettyCashAccountFormValues } from '@/ledger-accounts/ui/components/petty-cash-account-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useCreatePettyCashAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: IPettyCashAccountFormValues) => {
      return assetAccountService.createPettyCashAccount(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ledgerAccountService.getLedgerAccounts'],
      });
    },
  });
}
