import { journalEntriesQueryKey } from '@/journal-entries/hooks/use-journal-entries';
import { journalEntryQueryKey } from '@/journal-entries/hooks/use-journal-entry';
import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { IJournalEntryDeletionReq } from '@/shared/lib/api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IDeleteJournalEntryInput {
  id: string;
  payload: IJournalEntryDeletionReq;
}

export function useDeleteJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: IDeleteJournalEntryInput) =>
      journalEntryService.deleteJournalEntry(id, payload),

    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: journalEntriesQueryKey }),
        queryClient.invalidateQueries({ queryKey: journalEntryQueryKey(id) }),
      ]);
    },
  });
}
