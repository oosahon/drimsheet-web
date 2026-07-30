import type { IBankAccountFormValues } from '@/account/components/bank-account-form';
import { assetAccountMapper } from '@/account/lib/mappers/asset-account.mapper';
import { assetAccountService } from '@/account/lib/services/asset-account.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateBankAccount(accountingCurrencyCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: IBankAccountFormValues) => {
      const payload = assetAccountMapper.toBankAccountCreationDto(
        values,
        accountingCurrencyCode
      );
      return assetAccountService.createBankAccount(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['ledgerAccountService.getLedgerAccounts'],
      });
    },
  });
}
