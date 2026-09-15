import { bookkeepingService } from '@/bookkeeping/lib/services/bookkeeping.service';
import type { IPaginationDto } from '@/shared/lib/api/Api';
import { useQuery } from '@tanstack/react-query';

interface IParams {
  accountId?: string;
  pagination: IPaginationDto;
}

export function useAccountTransactions({ accountId, pagination }: IParams) {
  return useQuery({
    queryKey: [
      'bookkeepingService',
      'getAccountTransactions',
      accountId,
      pagination,
    ],

    queryFn: () =>
      bookkeepingService.getAccountTransactions(accountId!, pagination),

    enabled: !!accountId,
  });
}
