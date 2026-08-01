import type { IContractorFormValues } from '@/counterparty/components';
import { useCounterpartiesQueryKey } from '@/counterparty/hooks/use-counterparties';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateContractor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: IContractorFormValues) => {
      const payload = counterpartyMapper.toContractorCreateReq(values);
      return counterpartyService.createContractor(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useCounterpartiesQueryKey,
      });
    },
  });
}
