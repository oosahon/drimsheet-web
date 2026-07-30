import { bankService } from '@/account/lib/services/bank.service';
import { useQuery } from '@tanstack/react-query';

export function useGetBankByCountry(countryCode?: string) {
  return useQuery({
    queryKey: ['bankService', 'getBanksByCountry', countryCode],
    queryFn: () => bankService.getBanksByCountry(countryCode!),
    enabled: !!countryCode,
  });
}
