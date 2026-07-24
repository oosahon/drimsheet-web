import type { IAccountCreationFormValues } from '@/account/components/account-creation-form';
import type {
  IExchangeRateDto,
  IPettyCashAccountCreationReq,
} from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/currency.mapper';
import { moneyMapper } from '@/shared/lib/money.mapper';

function toPettyCashAccountCreationDto(
  values: IAccountCreationFormValues,
  accountingCurrencyCode: string
): IPettyCashAccountCreationReq {
  if (values.createWithoutOpeningBalance) {
    return {
      name: values.name,
      currencyCode: values.currencyCode,
      isControlAccount: false,
      openingBalance: null,
    };
  }

  const hasForeignCurrency = values.currencyCode !== accountingCurrencyCode;
  let exchangeRate: IExchangeRateDto | null = null;

  if (hasForeignCurrency) {
    exchangeRate = currencyMapper.toUserEnteredExchangeRate({
      baseCurrencyCode: values.currencyCode,
      targetCurrencyCode: accountingCurrencyCode,
      rate: Number(values.exchangeRate),
      asOf: values.openingDate,
    });
  }

  return {
    name: values.name,
    currencyCode: values.currencyCode,
    isControlAccount: false,
    openingBalance: {
      amount: moneyMapper.toMoneyDto(
        values.openingBalance,
        values.currencyCode
      ),
      date: values.openingDate,
      exchangeRate,
    },
  };
}

export const assetAccountMapper = Object.freeze({
  toPettyCashAccountCreationDto,
});
