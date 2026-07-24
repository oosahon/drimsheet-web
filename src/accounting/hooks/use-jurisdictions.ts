import { accountingService } from '@/accounting/lib/services/accounting.service';
import { useQuery } from '@tanstack/react-query';

export function useJurisdictions() {
  return useQuery({
    queryKey: ['accountingService.getJurisdiction'],
    queryFn: () => accountingService.getJurisdiction(),
    throwOnError: true,
  });
}
