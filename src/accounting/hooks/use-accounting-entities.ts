import accountingService from '@/accounting/services/accounting.service';
import { useQuery } from '@tanstack/react-query';

export default function useAccountingEntities() {
  return useQuery({
    queryKey: ['accountingService.getAccountingEntities'],
    queryFn: () => accountingService.getAccountingEntities(),
    throwOnError: true,
  });
}
