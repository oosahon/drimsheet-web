import { accountingService } from '@/accounting/lib/services/accounting.service';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useQuery } from '@tanstack/react-query';

export function useAccountingEntity(options: IReactQueryOptions = {}) {
  return useQuery({
    queryKey: ['accountingService.getAccountingEntity'],
    queryFn: () => accountingService.getAccountingEntity(),
    enabled: !options.disabled,
    throwOnError: options.throwOnError ?? true,
  });
}
