import type { IEmployerFormValues } from '@/counterparty/components';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateEmployer() {
  return useMutation({
    mutationFn: (values: IEmployerFormValues) => {
      const payload = counterpartyMapper.toEmployerCreateReq(values);
      return counterpartyService.createEmployer(payload);
    },
  });
}
