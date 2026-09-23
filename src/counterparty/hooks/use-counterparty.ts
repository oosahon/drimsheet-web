import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useQuery } from '@tanstack/react-query';

export function useCounterparty(id: string | undefined) {
  return useQuery({
    queryKey: ['counterpartyService', 'getCounterparty', id],
    queryFn: () => counterpartyService.getCounterparty(id!),
    enabled: Boolean(id),
    throwOnError: true,
  });
}
