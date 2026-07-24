import uiCurrencies from '@/shared/configs/currencies.json' with { type: 'json' };
import type { IMoneyDto } from '@/shared/lib/api/Api';
import { currencyService } from '@/shared/lib/services/currency.service';
import type { ComponentProps } from 'react';

interface MoneyProps extends ComponentProps<'span'> {
  value: IMoneyDto;
  localCode?: string;
  hide?: boolean;
}

const getMoneyDisplayAmount = (value: IMoneyDto): number => {
  const { amount, isMinorUnit, currencyCode } = value;

  const uiCurrency = uiCurrencies.find(
    (currency) =>
      currency.code.toLocaleLowerCase() === currencyCode.toLocaleLowerCase()
  );

  if (!uiCurrency) {
    // TODO: throw or report (decide later)
    return amount;
  }

  if (isMinorUnit) {
    return +(amount / 10 ** uiCurrency.minorUnit);
  } else {
    return amount;
  }
};

export function Money({
  value,
  localCode,
  hide,
  ...props
}: Readonly<MoneyProps>) {
  const locale = currencyService.getJurisdictionLocale(
    localCode || value.currencyCode
  );

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currencyCode,
  }).format(getMoneyDisplayAmount(value));

  return <span {...props}>{hide ? '******' : formatted}</span>;
}
