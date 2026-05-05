import { CurrencyLogo } from '@/shared/ui/components/currency-logo';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/shared/ui/components/item';
import Money from '@/shared/ui/components/money';
import type { ILedgerAccountDto } from '@/shared/utils/api/Api';
import { getCurrencyLogo } from '@/shared/utils/get-currency-logo';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AccountListItemProps {
  account: ILedgerAccountDto;
}

export function AccountListItem({ account }: AccountListItemProps) {
  return (
    <Link to="/auth/signup">
      <Item
        variant="outline"
        className="cursor-pointer w-80 max-w-full rounded-2xl py-2"
      >
        <ItemMedia>
          <CurrencyLogo
            className="w-9 h-9"
            url={getCurrencyLogo(account.balance.currencyCode)}
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="text-sm">{account.name}</ItemTitle>
          <ItemDescription>
            <Money className="text-xs" value={account.balance} />
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight />
        </ItemActions>
      </Item>
    </Link>
  );
}
