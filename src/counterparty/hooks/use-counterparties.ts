import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import type { IGetCounterpartiesQuery } from '@/shared/lib/api/Api';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useQuery } from '@tanstack/react-query';

export const useCounterpartiesQueryKey = [
  'counterpartyService',
  'getCounterparties',
];

interface ICounterpartiesQuery
  extends IGetCounterpartiesQuery, IReactQueryOptions {}

export function useCounterparties(config: ICounterpartiesQuery) {
  const { disabled, throwOnError, ...query } = config;

  return useQuery({
    queryKey: [...useCounterpartiesQueryKey, query],
    queryFn: () => counterpartyService.getCounterparties(query),
    enabled: !disabled,
    throwOnError,
  });
}
