import { bookkeepingService } from '@/bookkeeping/lib/services/bookkeeping.service';
import { useMutation } from '@tanstack/react-query';

export function useRecordTransferTransaction() {
  return useMutation({
    mutationFn: bookkeepingService.recordTransaction,
  });
}
