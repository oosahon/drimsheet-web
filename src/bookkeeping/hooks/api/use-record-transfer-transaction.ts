import bookkeepingService from '@/bookkeeping/services/bookkeeping.service';
import { useMutation } from '@tanstack/react-query';

export default function useRecordTransferTransaction() {
  return useMutation({
    mutationFn: bookkeepingService.recordTransaction,
  });
}
