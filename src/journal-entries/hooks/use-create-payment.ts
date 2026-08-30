import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { IPaymentEntryReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useCreatePayment() {
  return useMutation({
    mutationFn: (payload: IPaymentEntryReq) =>
      journalEntryService.createPayment(payload),
  });
}
