import type { IAccountCreationFormValues } from '@/account/components/account-creation-form';
import { assetAccountMapper } from '@/account/lib/asset-account.mapper';
import { assetAccountService } from '@/account/lib/asset-account.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePettyCashAccount(accountingCurrencyCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: IAccountCreationFormValues) => {
      const payload = assetAccountMapper.toPettyCashAccountCreationDto(
        values,
        accountingCurrencyCode
      );
      return assetAccountService.createPettyCashAccount(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ledgerAccountService.getLedgerAccounts'],
      });
    },
  });
}
