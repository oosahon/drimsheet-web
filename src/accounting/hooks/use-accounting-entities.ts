import { accountingService } from '@/accounting/lib/services/accounting.service';
import { useQuery } from '@tanstack/react-query';

export function useAccountingEntities() {
  return useQuery({
    queryKey: ['accountingService.getAccountingEntities'],
    queryFn: () => accountingService.getAccountingEntities(),
    throwOnError: true,
  });
}
