import { InputGroup, InputGroupAddon } from '@/shared/components/input-group';
import {
  MoneyInput,
  type MoneyInputProps,
} from '@/shared/components/money-input';
import { cn } from '@/shared/lib/utils/cn';
import { ArrowRightLeft } from 'lucide-react';

export interface CurrencyExchangeRateInputProps extends Omit<
  MoneyInputProps,
  'currencyCode' | 'defaultValue' | 'readOnly' | 'type'
> {
  baseCurrency: string;
  targetCurrency: string;
  defaultValue?: string | number;
  layout?: 'default' | 'compact';
}

const moneyInputClassName =
  'flex-1 rounded-none border-0 bg-transparent text-right tabular-nums shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent';

export function CurrencyExchangeRateInput({
  baseCurrency,
  targetCurrency,
  defaultValue,
  value,
  className,
  'aria-label': ariaLabel,
  disabled,
  layout = 'default',
  ...props
}: Readonly<CurrencyExchangeRateInputProps>) {
  const isCompact = layout === 'compact';

  return (
    <div
      className={cn(
        'flex items-center gap-4',
        isCompact &&
          'grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)] gap-2'
      )}
      data-slot="currency-exchange-rate-input"
      data-layout={layout}
    >
      <InputGroup className={cn('w-28', isCompact && 'w-full')} data-disabled>
        <MoneyInput
          aria-label={`${baseCurrency} base amount`}
          className={moneyInputClassName}
          currencyCode={baseCurrency}
          data-slot="input-group-control"
          disabled
          value={1}
        />
        <InputGroupAddon align="inline-start" className="text-foreground">
          {baseCurrency}
        </InputGroupAddon>
      </InputGroup>

      <ArrowRightLeft aria-hidden="true" className="size-4 shrink-0" />

      <InputGroup
        className={cn('w-36', isCompact && 'w-full')}
        data-disabled={disabled || undefined}
      >
        <MoneyInput
          {...props}
          aria-label={ariaLabel ?? `${targetCurrency} exchange rate`}
          className={cn(moneyInputClassName, className)}
          currencyCode={targetCurrency}
          data-slot="input-group-control"
          disabled={disabled}
          value={value ?? defaultValue}
        />
        <InputGroupAddon align="inline-start" className="text-foreground">
          {targetCurrency}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
