import assetAccountService from '@/ledger-accounts/services/asset-account.service';
import type { IPettyCashAccountFormValues } from '@/ledger-accounts/ui/petty-cash-account-form';
import { useMutation } from '@tanstack/react-query';

export default function useCreatePettyCashAccount() {
  return useMutation({
    mutationFn: (payload: IPettyCashAccountFormValues) => {
      return assetAccountService.createPettyCashAccount(payload);
    },
  });
}
