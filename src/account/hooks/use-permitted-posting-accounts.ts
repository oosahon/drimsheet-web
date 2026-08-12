import { ledgerAccountService } from '@/account/lib/services/ledger-account.service';
import type { IGetPermittedPostingAccountsQuery } from '@/shared/lib/api/Api';
import type { IReactQueryOptions } from '@/shared/types/query-options.types';
import { useQuery } from '@tanstack/react-query';

interface IPermittedPostingAccountsQuery
  extends IGetPermittedPostingAccountsQuery, IReactQueryOptions {}

export function usePermittedPostingAccounts(
  config: IPermittedPostingAccountsQuery
) {
  const { disabled, throwOnError, ...query } = config;

  return useQuery({
    queryKey: ['ledgerAccountService', 'getPermittedPostingAccounts', query],
    queryFn: () => ledgerAccountService.getPermittedPostingAccounts(query),
    enabled: !disabled,
    throwOnError,
  });
}
