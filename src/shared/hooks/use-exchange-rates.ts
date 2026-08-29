import type { IExchangeRateQueryParam } from '@/shared/lib/api/Api';
import { currencyService } from '@/shared/lib/services/currency.service';
import { useQuery } from '@tanstack/react-query';

export function useExchangeRates(query?: IExchangeRateQueryParam) {
  return useQuery({
    queryKey: ['currencyService', 'getExchangeRates', query],
    queryFn: () => currencyService.getExchangeRates(query!),
    enabled: query !== undefined,
  });
}
