import type { ICounterpartyFormValues } from '@/counterparty/components';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateCounterparty() {
  return useMutation({
    mutationFn: (values: ICounterpartyFormValues) => {
      const payload = counterpartyMapper.toCounterpartyCreateReq(values);
      return counterpartyService.createCounterparty(payload);
    },
  });
}
