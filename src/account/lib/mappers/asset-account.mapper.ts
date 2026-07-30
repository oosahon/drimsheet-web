import type { IBankAccountFormValues } from '@/account/components/bank-account-form';
import type { IPettyCashAccountFormValues } from '@/account/components/petty-cash-account-form';
import type {
  IBankAccountCreationReq,
  IBankDetailsCreationReq,
  IExchangeRateDto,
  IPettyCashAccountCreationReq,
} from '@/shared/lib/api/Api';
import { currencyMapper } from '@/shared/lib/mappers/currency.mapper';
import { moneyMapper } from '@/shared/lib/mappers/money.mapper';

function toPettyCashAccountCreationDto(
  values: IPettyCashAccountFormValues,
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

function toBankAccountCreationDto(
  values: IBankAccountFormValues,
  accountingCurrencyCode: string
): IBankAccountCreationReq {
  const bankAccount: IBankDetailsCreationReq = {
    bankName: values.bankName,
    accountName: values.accountName,
    accountNumber: values.accountNumber,
  };

  if (values.createWithoutOpeningBalance) {
    return {
      name: values.name,
      currencyCode: values.currencyCode,
      bankAccount,
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
    bankAccount,
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
  toBankAccountCreationDto,
});
