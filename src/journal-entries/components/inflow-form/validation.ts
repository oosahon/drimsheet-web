import type { ILedgerAccountDto } from '@/shared/lib/api/Api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { isInflowFormExchangeRateRequired } from './helpers/is-inflow-form-exchange-rate-required.helper';
import type { IInflowFormValues } from './types';

export interface IInflowFormValidationMessages {
  accountRequired: string;
  amountPositive: string;
  amountRequired: string;
  categoryRequired: string;
  exchangeRateNumber: string;
  exchangeRatePositive: string;
  exchangeRateRequired: string;
  payerRequired: string;
}

function requiresExchangeRate(
  destinationAccountId: string,
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string
) {
  const destinationCurrencyCode = destinationAccounts.find(
    (account) => account.id === destinationAccountId
  )?.balance.currencyCode;

  return isInflowFormExchangeRateRequired(
    destinationCurrencyCode,
    functionalCurrencyCode
  );
}

export function createInflowFormValidation(
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string,
  messages: IInflowFormValidationMessages
) {
  const exchangeRateValidation = yup
    .string()
    .test('required-exchange-rate', messages.exchangeRateRequired, function () {
      const values = this.parent as IInflowFormValues;
      const required = requiresExchangeRate(
        values.destinationAccountId,
        destinationAccounts,
        functionalCurrencyCode
      );

      return !required || Boolean(values.exchangeRate?.trim());
    })
    .test('numeric-exchange-rate', messages.exchangeRateNumber, function () {
      const values = this.parent as IInflowFormValues;
      const required = requiresExchangeRate(
        values.destinationAccountId,
        destinationAccounts,
        functionalCurrencyCode
      );
      const exchangeRate = values.exchangeRate?.trim();

      if (!required || !exchangeRate) return true;

      return Number.isFinite(Number(exchangeRate));
    })
    .test('positive-exchange-rate', messages.exchangeRatePositive, function () {
      const values = this.parent as IInflowFormValues;
      const required = requiresExchangeRate(
        values.destinationAccountId,
        destinationAccounts,
        functionalCurrencyCode
      );
      const exchangeRate = values.exchangeRate?.trim();

      if (
        !required ||
        !exchangeRate ||
        !Number.isFinite(Number(exchangeRate))
      ) {
        return true;
      }

      return Number(exchangeRate) > 0;
    });

  return yup.object({
    destinationAccountId: yup.string().required(messages.accountRequired),
    categoryAccountId: yup.string().required(messages.categoryRequired),
    amount: yup.object({
      amount: yup
        .number()
        .typeError(messages.amountRequired)
        .required(messages.amountRequired)
        .moreThan(0, messages.amountPositive),
      currencyCode: yup.string().defined(),
      isMinorUnit: yup.boolean().defined(),
    }),
    exchangeRate: exchangeRateValidation,
    payer: yup.object({
      id: yup.string().optional(),
      name: yup.string().trim().required(messages.payerRequired),
      type: yup.string().optional(),
    }),
    description: yup.string().optional(),
  });
}

export function useInflowFormValidation(
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string
) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  return useMemo(
    () =>
      createInflowFormValidation(destinationAccounts, functionalCurrencyCode, {
        accountRequired: t('inflow_account_required_text'),
        amountPositive: t('inflow_amount_positive_text'),
        amountRequired: t('inflow_amount_required_text'),
        categoryRequired: t('inflow_category_required_text'),
        exchangeRateNumber: t('inflow_exchange_rate_number_text'),
        exchangeRatePositive: t('inflow_exchange_rate_positive_text'),
        exchangeRateRequired: t('inflow_exchange_rate_required_text'),
        payerRequired: t('inflow_payer_required_text'),
      }),
    [destinationAccounts, functionalCurrencyCode, t]
  );
}
