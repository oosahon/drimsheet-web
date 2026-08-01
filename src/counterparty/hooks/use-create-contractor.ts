import type { IContractorFormValues } from '@/counterparty/components';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateContractor() {
  return useMutation({
    mutationFn: (values: IContractorFormValues) => {
      const payload = counterpartyMapper.toContractorCreateReq(values);
      return counterpartyService.createContractor(payload);
    },
  });
}
