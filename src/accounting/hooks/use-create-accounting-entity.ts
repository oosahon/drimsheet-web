import {
  accountingService,
  type CreateAccountingEntityInput,
} from '@/accounting/lib/accounting.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateAccountingEntity() {
  return useMutation({
    mutationFn: (data: CreateAccountingEntityInput) =>
      accountingService.createAccountingEntity(data),
    throwOnError: true,
  });
}
