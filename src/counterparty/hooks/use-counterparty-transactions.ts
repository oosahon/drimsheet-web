import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import type { IGetJournalEntriesQuery } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

export function useCounterpartyTransactions(
  query: IGetJournalEntriesQuery,
  enabled: boolean
) {
  return useQuery({
    queryKey: ['counterpartyService', 'getCounterpartyTransactions', query],
    queryFn: () => counterpartyService.getCounterpartyTransactions(query),
    enabled: enabled && Boolean(query.counterpartyId),
    throwOnError: true,
  });
}
