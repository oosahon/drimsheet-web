import type { IPettyCashAccountFormValues } from '@/account/components/petty-cash-account-form';
import { assetAccountService } from '@/account/lib/asset-account.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePettyCashAccount() {
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
