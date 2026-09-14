import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { ITransferEntryReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useCreateTransfer() {
  return useMutation({
    mutationFn: (payload: ITransferEntryReq) =>
      journalEntryService.createTransfer(payload),
  });
}
