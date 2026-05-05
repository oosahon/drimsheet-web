import uiCurrencies from '@/shared/config/currencies.json' with { type: 'json' };
import currencyService from '@/shared/services/currency.service';
import type { IMoneyDto } from '@/shared/utils/api/Api';
import type { ComponentProps } from 'react';

interface MoneyProps extends ComponentProps<'span'> {
  value: IMoneyDto;
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

export default function Money({ value, hide, ...props }: MoneyProps) {
  const locale = currencyService.getJurisdictionLocale(value.currencyCode);

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: value.currencyCode,
  }).format(getMoneyDisplayAmount(value));

  return <span {...props}>{hide ? '******' : formatted}</span>;
}
