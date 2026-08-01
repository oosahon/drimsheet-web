import type { ICounterpartyFormValues } from '@/counterparty/components';
import { useCounterpartiesQueryKey } from '@/counterparty/hooks/use-counterparties';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateCounterparty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ICounterpartyFormValues) => {
      const payload = counterpartyMapper.toCounterpartyCreateReq(values);
      return counterpartyService.createCounterparty(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useCounterpartiesQueryKey,
      });
    },
  });
}
