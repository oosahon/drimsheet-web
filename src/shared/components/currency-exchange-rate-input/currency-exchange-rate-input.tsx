import { InputGroup, InputGroupAddon } from '@/shared/components/input-group';
import {
  MoneyInput,
  type MoneyInputProps,
} from '@/shared/components/money-input';
import { cn } from '@/shared/lib/cn';
import { ArrowRightLeft } from 'lucide-react';

export interface CurrencyExchangeRateInputProps extends Omit<
  MoneyInputProps,
  'currencyCode' | 'defaultValue' | 'readOnly' | 'type'
> {
  baseCurrency: string;
  targetCurrency: string;
  defaultValue?: string | number;
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
  ...props
}: Readonly<CurrencyExchangeRateInputProps>) {
  return (
    <div
      className="flex items-center gap-4"
      data-slot="currency-exchange-rate-input"
    >
      <InputGroup className="w-28" data-disabled>
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

      <ArrowRightLeft aria-hidden="true" className="size-8 shrink-0" />

      <InputGroup className="w-36" data-disabled={disabled || undefined}>
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
