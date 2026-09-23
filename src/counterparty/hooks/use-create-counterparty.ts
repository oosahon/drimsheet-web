import { useCounterpartiesQueryKey } from '@/counterparty/hooks/use-counterparties';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import type { ICounterpartyCreateReq } from '@/shared/lib/api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateCounterparty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ICounterpartyCreateReq) =>
      counterpartyService.createCounterparty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useCounterpartiesQueryKey,
      });
    },
  });
}
