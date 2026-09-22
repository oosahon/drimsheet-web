import { journalEntriesQueryKey } from '@/journal-entries/hooks/use-journal-entries';
import { journalEntryQueryKey } from '@/journal-entries/hooks/use-journal-entry';
import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { IJournalEntryArchiveReq } from '@/shared/lib/api/Api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface IArchiveJournalEntryInput {
  id: string;
  payload: IJournalEntryArchiveReq;
}

export function useArchiveJournalEntry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: IArchiveJournalEntryInput) =>
      journalEntryService.archiveJournalEntry(id, payload),
    onSuccess: async (_, { id }) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: journalEntriesQueryKey }),
        queryClient.invalidateQueries({ queryKey: journalEntryQueryKey(id) }),
      ]);
    },
  });
}
