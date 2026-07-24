import { currencyService } from '@/shared/lib/services/currency.service';
import { useQuery } from '@tanstack/react-query';

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencyService.getAll'],
    queryFn: () => currencyService.getAll(),
  });
}
