import type { IPettyCashFormValues } from '@/account/components/petty-cash-form';
import { assetAccountMapper } from '@/account/lib/mappers/asset-account.mapper';
import { assetAccountService } from '@/account/lib/services/asset-account.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreatePettyCashAccount(accountingCurrencyCode: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (values: IPettyCashFormValues) => {
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
