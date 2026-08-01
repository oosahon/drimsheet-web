import type { IEmployerFormValues } from '@/counterparty/components';
import { useCounterpartiesQueryKey } from '@/counterparty/hooks/use-counterparties';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateEmployer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: IEmployerFormValues) => {
      const payload = counterpartyMapper.toEmployerCreateReq(values);
      return counterpartyService.createEmployer(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useCounterpartiesQueryKey,
      });
    },
  });
}
