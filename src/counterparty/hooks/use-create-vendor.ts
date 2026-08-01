import type { IVendorFormValues } from '@/counterparty/components';
import { useCounterpartiesQueryKey } from '@/counterparty/hooks/use-counterparties';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCreateVendor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: IVendorFormValues) => {
      const payload = counterpartyMapper.toVendorCreateReq(values);
      return counterpartyService.createVendor(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: useCounterpartiesQueryKey,
      });
    },
  });
}
