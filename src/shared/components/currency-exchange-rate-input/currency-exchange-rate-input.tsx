import { FieldDescription } from '@/shared/components/field';
import { InputGroup, InputGroupAddon } from '@/shared/components/input-group';
import {
  MoneyInput,
  type MoneyInputProps,
} from '@/shared/components/money-input';
import type { IExchangeRate } from '@/shared/lib/api/Api';
import { cn } from '@/shared/lib/utils/cn';
import { ArrowRightLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import helpers from './helper';

export interface CurrencyExchangeRateInputProps extends Omit<
  MoneyInputProps,
  'currencyCode' | 'defaultValue' | 'readOnly' | 'type'
> {
  baseCurrency: string;
  targetCurrency: string;
  defaultValue?: string | number;
  displayOfficialRate?: boolean;
  layout?: 'default' | 'compact';
  officialRate?: IExchangeRate;
}

const moneyInputClassName =
  'flex-1 rounded-none border-0 bg-transparent text-right tabular-nums shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent';

export function CurrencyExchangeRateInput({
  baseCurrency,
  targetCurrency,
  defaultValue,
  displayOfficialRate = false,
  value,
  className,
  'aria-label': ariaLabel,
  disabled,
  layout = 'default',
  officialRate,
  ...props
}: Readonly<CurrencyExchangeRateInputProps>) {
  const { t } = useTranslation<'shared'>('shared');

  const isCompact = layout === 'compact';
  const resolvedValue = helpers.getValue(value, defaultValue, officialRate);

  const official_rate_available_text = t(
    'official_exchange_rate_available_text'
  );
  const official_rate_unavailable_text = t(
    'official_exchange_rate_unavailable_text'
  );

  return (
    <div
      className={cn(displayOfficialRate && 'flex w-full flex-col gap-1')}
      data-slot="currency-exchange-rate-input"
      data-layout={layout}
    >
      <div
        className={cn(
          'flex items-center gap-4',
          isCompact &&
            'grid w-full grid-cols-[minmax(0,1fr)_auto_minmax(0,1.25fr)] gap-2',
          displayOfficialRate && 'w-full'
        )}
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
            value={resolvedValue}
          />
          <InputGroupAddon align="inline-start" className="text-foreground">
            {targetCurrency}
          </InputGroupAddon>
        </InputGroup>
      </div>

      {displayOfficialRate && officialRate && (
        <FieldDescription className="text-xs text-success">
          {official_rate_available_text}{' '}
          <span className="font-semibold">{officialRate.rate}</span>
        </FieldDescription>
      )}

      {displayOfficialRate && !officialRate && (
        <FieldDescription className="text-xs text-warning">
          {official_rate_unavailable_text}
        </FieldDescription>
      )}
    </div>
  );
}
