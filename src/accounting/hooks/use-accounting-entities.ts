import { accountingService } from '@/accounting/lib/services/accounting.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useQuery } from '@tanstack/react-query';

export function useAccountingEntities(options: IReactQueryOptions = {}) {
  return useQuery({
    queryKey: ['accountingService', 'getAccountingEntities'],
    queryFn: () => accountingService.getAccountingEntities(),
    enabled: !options.disabled,
    throwOnError: options.throwOnError ?? true,
  });
}
