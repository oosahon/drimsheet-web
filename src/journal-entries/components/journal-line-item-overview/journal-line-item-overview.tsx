import type { JournalLineItemOverviewProps } from '@/journal-entries/components/journal-line-item-overview/types';
import { BalanceEffectIcon } from '@/shared/components/balance-effect-icon';
import { FormattedDate } from '@/shared/components/date';
import { Item, ItemContent, ItemTitle } from '@/shared/components/item';
import { Money } from '@/shared/components/money';
import { cn } from '@/shared/lib/utils/cn';
import { useTranslation } from 'react-i18next';

function JournalLineItemOverview({
  categoryName,
  effectiveDate,
  amount,
  functionalAmount,
  balanceEffect,
  countryCode,
  className,
  variant = 'muted',
  ...props
}: Readonly<JournalLineItemOverviewProps>) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  const shouldShowFunctionalAmount =
    amount.currencyCode.toLocaleLowerCase() !==
    functionalAmount.currencyCode.toLocaleLowerCase();

  const balanceEffectLabel = {
    increase: t('journal_line_balance_effect_increase_label'),
    decrease: t('journal_line_balance_effect_decrease_label'),
    noop: t('journal_line_balance_effect_noop_label'),
  }[balanceEffect];

  return (
    <Item
      role="article"
      variant={variant}
      className={cn(
        'grid min-h-18 grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4 rounded-lg px-5 py-4',
        className
      )}
      {...props}
    >
      <BalanceEffectIcon
        role="img"
        aria-label={balanceEffectLabel}
        effect={balanceEffect}
        className="size-10 [&_svg]:size-5"
      />

      <ItemContent className="min-w-0 gap-1">
        <ItemTitle className="block w-auto truncate text-base font-medium">
          {categoryName}
        </ItemTitle>
        <FormattedDate
          value={effectiveDate}
          countryCode={countryCode}
          className="truncate text-sm leading-none"
        />
      </ItemContent>

      <ItemContent className="min-w-0 flex-none items-end gap-1 text-right">
        <Money
          value={amount}
          localCode={countryCode}
          className="max-w-full truncate text-xl font-semibold leading-none tabular-nums"
        />

        {shouldShowFunctionalAmount && (
          <span className="flex max-w-full items-center gap-1 text-xs leading-none text-muted-foreground tabular-nums">
            <span aria-hidden="true">≈</span>
            <Money
              value={functionalAmount}
              localCode={countryCode}
              className="truncate"
            />
          </span>
        )}
      </ItemContent>
    </Item>
  );
}

export { JournalLineItemOverview };
