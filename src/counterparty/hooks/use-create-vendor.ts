import type { IVendorFormValues } from '@/counterparty/components';
import { counterpartyMapper } from '@/counterparty/lib/mappers/counterparty.mapper';
import { counterpartyService } from '@/counterparty/lib/services/counterparty.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateVendor() {
  return useMutation({
    mutationFn: (values: IVendorFormValues) => {
      const payload = counterpartyMapper.toVendorCreateReq(values);
      return counterpartyService.createVendor(payload);
    },
  });
}
