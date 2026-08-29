import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { IReceiptEntryReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useCreateReceipt() {
  return useMutation({
    mutationFn: (payload: IReceiptEntryReq) =>
      journalEntryService.createReceipt(payload),
  });
}
