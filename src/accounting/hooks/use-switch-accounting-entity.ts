import { accountingService } from '@/accounting/lib/services/accounting.service';
import type { IAccountingEntitySwitchReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useSwitchAccountingEntity() {
  return useMutation({
    mutationFn: (data: IAccountingEntitySwitchReq) =>
      accountingService.switchAccountingEntity(data),
  });
}
