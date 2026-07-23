import { bookkeepingService } from '@/bookkeeping/lib/bookkeeping.service';
import { useMutation } from '@tanstack/react-query';

export function useRecordTransferTransaction() {
  return useMutation({
    mutationFn: bookkeepingService.recordTransaction,
  });
}
