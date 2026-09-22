import { journalEntriesQueryKey } from '@/journal-entries/hooks/use-journal-entries';
import { journalEntryQueryKey } from '@/journal-entries/hooks/use-journal-entry';
import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { TJournalEntryRectificationReq } from '@/shared/lib/api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IRectifyJournalEntryInput {
  id: string;
  payload: TJournalEntryRectificationReq;
}

export function useRectifyJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: IRectifyJournalEntryInput) =>
      journalEntryService.rectifyJournalEntry(id, payload),
    onSuccess: async (data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: journalEntryQueryKey(variables.id),
        }),
        queryClient.invalidateQueries({
          queryKey: journalEntryQueryKey(data.currentJournalEntryId),
        }),
        queryClient.invalidateQueries({ queryKey: journalEntriesQueryKey }),
      ]);
    },
  });
}
