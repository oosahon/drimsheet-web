import journalEntryService from '@/journal-entries/lib/services/journal-entry.service';
import { parseApiError } from '@/shared/lib/api';
import { useQuery } from '@tanstack/react-query';

export const journalEntryQueryKey = (id: string | undefined) =>
  ['journalEntryService', 'getJournalEntry', id] as const;

export function useJournalEntry(id: string | undefined) {
  return useQuery({
    queryKey: journalEntryQueryKey(id),
    queryFn: () => journalEntryService.getJournalEntry(id ?? ''),
    enabled: Boolean(id),
    retry: (failureCount, error) =>
      parseApiError(error).statusCode !== 404 && failureCount < 3,
    throwOnError: (error) => parseApiError(error).statusCode !== 404,
  });
}
