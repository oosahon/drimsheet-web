import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import type { IGetJournalEntriesQuery } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

export const journalEntriesQueryKey = [
  'journalEntryService',
  'getJournalEntries',
] as const;

export function useJournalEntries(query: IGetJournalEntriesQuery) {
  return useQuery({
    queryKey: [...journalEntriesQueryKey, query],
    queryFn: () => journalEntryService.getJournalEntries(query),
    throwOnError: true,
  });
}
