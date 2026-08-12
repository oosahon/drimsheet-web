import type { IInflowFormValues } from '@/journal-entries/components/inflow-form';
import { journalEntryMapper } from '@/journal-entries/lib/mappers/journal-entry.mapper';
import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import { useMutation } from '@tanstack/react-query';

export function useCreateReceipt(functionalCurrencyCode: string) {
  return useMutation({
    mutationFn: (values: IInflowFormValues) => {
      const occurredAt = new Date().toISOString();
      const payload = journalEntryMapper.toReceiptEntryReq(
        values,
        functionalCurrencyCode,
        occurredAt
      );

      return journalEntryService.createReceipt(payload);
    },
  });
}
