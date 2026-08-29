import { BalanceEffectIcon } from '@/shared/components/balance-effect-icon';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/shared/components/item';
import { Money } from '@/shared/components/money';
import { StatusBadge } from '@/shared/components/status-badge';
import { cn } from '@/shared/lib/utils/cn';
import type { ComponentProps } from 'react';

interface TransactionCardProps extends ComponentProps<typeof Item> {
  constinerProps?: ComponentProps<'div'>;
  direction: 'increase' | 'decrease' | 'noop';
}

function TransactionCard({
  className,
  constinerProps = {},
  direction,
  variant = 'default',
  ...props
}: Readonly<TransactionCardProps>) {
  const { className: containerClassName, ...containerProps } = constinerProps;

  return (
    <div
      className={cn('flex w-full flex-col gap-6', containerClassName)}
      {...containerProps}
    >
      <Item
        variant={variant}
        className={cn('min-h-24 gap-5 px-5 py-4', className)}
        {...props}
      >
        <BalanceEffectIcon effect={direction} />

        <ItemContent className="min-w-0 gap-2">
          <ItemTitle className="line-clamp-1 text-xl font-medium">
            Stamp Duty
          </ItemTitle>
          <ItemDescription className="line-clamp-1 text-xl leading-none text-muted-foreground">
            Jun 1st, 10:13:59
          </ItemDescription>
        </ItemContent>

        <ItemContent className="flex-none items-end gap-4 text-right">
          <Money
            className="text-2xl font-semibold leading-none"
            value={{ amount: 5000, currencyCode: 'NGN', isMinorUnit: false }}
          />

          <StatusBadge
            className="rounded-md px-3 py-1 text-base font-medium text-sm"
            label="Successful"
            showDot={false}
            variant="success"
          />
        </ItemContent>
      </Item>
    </div>
  );
}

export { TransactionCard };
