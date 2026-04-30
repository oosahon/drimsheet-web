import accountingService from '@/accounting/services/accounting.service';
import type { IAccountingEntityFormValues } from '@/accounting/ui/accounting-entity-creation-form';
import { useMutation } from '@tanstack/react-query';

export default function useCreateAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntityFormValues) =>
      accountingService.createAccountingEntity(data),
    throwOnError: true,
  });
}
