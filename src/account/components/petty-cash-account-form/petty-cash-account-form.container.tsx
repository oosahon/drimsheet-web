import { assetAccountMapper } from '@/account/lib/mappers/asset-account.mapper';
import type { IOpeningBalanceExchangeRateContext } from '@/account/lib/types/opening-balance-exchange-rate.types';
import { useExchangeRates } from '@/shared/hooks/use-exchange-rates';
import { useState } from 'react';
import { PettyCashAccountForm } from './petty-cash-account-form';
import type { PettyCashAccountFormProps } from './types';

export type PettyCashAccountFormContainerProps = Omit<
  PettyCashAccountFormProps,
  'officialExchangeRate' | 'onExchangeRateContextChange'
>;

export function PettyCashAccountFormContainer({
  accountingCurrencyCode,
  initialValues,
  ...props
}: Readonly<PettyCashAccountFormContainerProps>) {
  const [exchangeRateContext, setExchangeRateContext] =
    useState<IOpeningBalanceExchangeRateContext>({
      currencyCode: initialValues?.currencyCode ?? '',
      date: initialValues?.openingDate ?? '',
      createWithoutOpeningBalance:
        initialValues?.createWithoutOpeningBalance ?? false,
    });

  const exchangeRateQuery =
    assetAccountMapper.toOpeningBalanceExchangeRateQuery(
      exchangeRateContext,
      accountingCurrencyCode
    );
  const { data: officialExchangeRates } = useExchangeRates(exchangeRateQuery);

  return (
    <PettyCashAccountForm
      {...props}
      accountingCurrencyCode={accountingCurrencyCode}
      initialValues={initialValues}
      officialExchangeRate={officialExchangeRates?.[0]}
      onExchangeRateContextChange={setExchangeRateContext}
    />
  );
}
