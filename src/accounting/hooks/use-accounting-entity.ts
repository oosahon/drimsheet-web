import { accountingService } from '@/accounting/lib/services/accounting.service';
import { useQuery } from '@tanstack/react-query';

export function useAccountingEntity() {
  return useQuery({
    queryKey: ['accountingService.getAccountingEntity'],
    queryFn: () => accountingService.getAccountingEntity(),
    throwOnError: true,
  });
}
