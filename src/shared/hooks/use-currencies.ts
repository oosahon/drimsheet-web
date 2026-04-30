import currencyService from '@/shared/services/currency.service';
import { useQuery } from '@tanstack/react-query';

export default function useCurrencies() {
  return useQuery({
    queryKey: ['currencyService.getAll'],
    queryFn: () => currencyService.getAll(),
  });
}
