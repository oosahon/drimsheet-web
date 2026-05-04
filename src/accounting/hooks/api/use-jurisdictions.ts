import accountingService from '@/accounting/services/accounting.service';
import { useQuery } from '@tanstack/react-query';

export default function useJurisdictions() {
  return useQuery({
    queryKey: ['accountingService.getJurisdiction'],
    queryFn: () => accountingService.getJurisdiction(),
    throwOnError: true,
  });
}
