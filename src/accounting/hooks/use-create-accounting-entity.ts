import { accountingService } from '@/accounting/lib/services/accounting.service';
import type { IAccountingEntityCreationDto } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useCreateAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntityCreationDto) =>
      accountingService.createAccountingEntity(data),
  });
}
