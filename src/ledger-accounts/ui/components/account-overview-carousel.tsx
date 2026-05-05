import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/ui/components/carousel';
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

interface AccountCarouselItemProps {
  account: ILedgerAccountDto;
}

interface AccountOverviewCarouselProps {
  accounts: ILedgerAccountDto[];
}

export function AccountCarouselItem({ account }: AccountCarouselItemProps) {
  return (
    <Link to="/auth/signup">
      <Item
        variant="outline"
        className="cursor-pointer w-80 max-w-full rounded-2xl py-1"
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

export function AccountOverviewCarousel({
  accounts,
}: AccountOverviewCarouselProps) {
  return (
    <Carousel className="w-full max-w-[1000px]">
      <CarouselContent>
        {accounts?.map((account) => (
          <CarouselItem
            key={account.id}
            className="basis-full sm:basis-1/2 lg:basis-1/3"
          >
            <AccountCarouselItem account={account} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
