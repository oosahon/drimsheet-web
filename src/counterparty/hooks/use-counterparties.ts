import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import type { IGetCounterpartiesQuery } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

export const useCounterpartiesQueryKey = [
  'counterpartyService',
  'getCounterparties',
];

export function useCounterparties(query: IGetCounterpartiesQuery) {
  return useQuery({
    queryKey: [...useCounterpartiesQueryKey, query],
    queryFn: () => counterpartyService.getCounterparties(query),
  });
}
