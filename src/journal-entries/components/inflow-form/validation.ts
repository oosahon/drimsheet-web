import type { IExchangeRate, ILedgerAccountDto } from '@/shared/lib/api/Api';
import { dateUtils } from '@/shared/lib/utils/date';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import inflowFormHelpers from './inflow-form.helper';
import type { IInflowFormValues } from './types';

const MAX_RECEIPT_SIZE_BYTES = 2 * 1024 * 1024;
const ACCEPTED_RECEIPT_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'application/pdf',
]);
const ACCEPTED_RECEIPT_EXTENSIONS = ['.jpeg', '.jpg', '.png', '.pdf'];

export interface IInflowFormValidationMessages {
  accountRequired: string;
  amountPositive: string;
  amountRequired: string;
  categoryRequired: string;
  dateBeforeAccountOpening: string;
  dateFuture: string;
  dateRequired: string;
  exchangeRateNumber: string;
  exchangeRatePositive: string;
  exchangeRateRequired: string;
  itemAmountPositive: string;
  itemAmountRequired: string;
  itemCategoryRequired: string;
  itemsRequired: string;
  payerRequired: string;
  receiptSize: string;
  receiptType: string;
}

function requiresExchangeRate(
  destinationAccountId: string,
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string
) {
  const destinationCurrencyCode = destinationAccounts.find(
    (account) => account.id === destinationAccountId
  )?.balance.currencyCode;

  return inflowFormHelpers.isExchangeRateRequired(
    destinationCurrencyCode,
    functionalCurrencyCode
  );
}

function isAcceptedReceipt(file: File) {
  const lowerName = file.name.toLowerCase();

  return (
    ACCEPTED_RECEIPT_TYPES.has(file.type) &&
    ACCEPTED_RECEIPT_EXTENSIONS.some((extension) =>
      lowerName.endsWith(extension)
    )
  );
}

export function createInflowFormValidation(
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string,
  messages: IInflowFormValidationMessages,
  officialExchangeRate?: IExchangeRate
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
      const destinationCurrencyCode = destinationAccounts.find(
        (account) => account.id === values.destinationAccountId
      )?.balance.currencyCode;
      const hasOfficialRate = inflowFormHelpers.matchesOfficialRate(
        officialExchangeRate,
        destinationCurrencyCode ?? '',
        functionalCurrencyCode,
        values.date
      );

      return (
        !required || hasOfficialRate || Boolean(values.exchangeRate?.trim())
      );
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

  const moneyValidation = yup.object({
    amount: yup
      .number()
      .typeError(messages.itemAmountRequired)
      .required(messages.itemAmountRequired)
      .moreThan(0, messages.itemAmountPositive),
    currencyCode: yup.string().defined(),
    isMinorUnit: yup.boolean().defined(),
  });

  return yup.object({
    destinationAccountId: yup.string().required(messages.accountRequired),
    sourceAccountId: yup.string().when('isItemized', {
      is: false,
      then: (schema) => schema.required(messages.categoryRequired),
      otherwise: (schema) => schema.optional(),
    }),
    amount: yup.mixed().when('isItemized', {
      is: true,
      then: () =>
        yup.object({
          amount: yup.mixed<number>().defined(),
          currencyCode: yup.string().defined(),
          isMinorUnit: yup.boolean().defined(),
        }),
      otherwise: () =>
        yup.object({
          amount: yup
            .number()
            .typeError(messages.amountRequired)
            .required(messages.amountRequired)
            .moreThan(0, messages.amountPositive),
          currencyCode: yup.string().defined(),
          isMinorUnit: yup.boolean().defined(),
        }),
    }),
    date: yup
      .string()
      .required(messages.dateRequired)
      .test('not-in-future', messages.dateFuture, (value) =>
        value ? dateUtils.isNotInTheFuture(value) : true
      )
      .test(
        'not-before-account-opening',
        messages.dateBeforeAccountOpening,
        function (value) {
          if (!value) return true;

          const values = this.parent as IInflowFormValues;
          const openingBalanceDate = destinationAccounts.find(
            (account) => account.id === values.destinationAccountId
          )?.openingBalanceDate;

          return openingBalanceDate
            ? dateUtils.isOnOrAfter(value, openingBalanceDate)
            : true;
        }
      ),
    exchangeRate: exchangeRateValidation,
    isItemized: yup.boolean().defined(),
    items: yup
      .array()
      .of(
        yup.object({
          id: yup.string().defined(),
          amount: moneyValidation,
          accountId: yup.string().required(messages.itemCategoryRequired),
          description: yup.string().optional(),
        })
      )
      .when('isItemized', {
        is: true,
        then: (schema) => schema.min(1, messages.itemsRequired),
        otherwise: (schema) => schema.optional(),
      }),
    payer: yup.object({
      id: yup.string().optional(),
      name: yup.string().trim().required(messages.payerRequired),
      type: yup.string().optional(),
    }),
    description: yup.string().optional(),
    receipt: yup
      .mixed<File>()
      .nullable()
      .test('receipt-type', messages.receiptType, (file) =>
        file ? isAcceptedReceipt(file) : true
      )
      .test('receipt-size', messages.receiptSize, (file) =>
        file ? file.size <= MAX_RECEIPT_SIZE_BYTES : true
      ),
  });
}

export function useInflowFormValidation(
  destinationAccounts: ILedgerAccountDto[],
  functionalCurrencyCode: string,
  officialExchangeRate?: IExchangeRate
) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  return useMemo(
    () =>
      createInflowFormValidation(
        destinationAccounts,
        functionalCurrencyCode,
        {
          accountRequired: t('inflow_account_required_text'),
          amountPositive: t('inflow_amount_positive_text'),
          amountRequired: t('inflow_amount_required_text'),
          categoryRequired: t('inflow_category_required_text'),
          dateBeforeAccountOpening: t(
            'inflow_date_before_account_opening_text'
          ),
          dateFuture: t('inflow_date_future_text'),
          dateRequired: t('inflow_date_required_text'),
          exchangeRateNumber: t('inflow_exchange_rate_number_text'),
          exchangeRatePositive: t('inflow_exchange_rate_positive_text'),
          exchangeRateRequired: t('inflow_exchange_rate_required_text'),
          itemAmountPositive: t('inflow_item_amount_positive_text'),
          itemAmountRequired: t('inflow_item_amount_required_text'),
          itemCategoryRequired: t('inflow_item_category_required_text'),
          itemsRequired: t('inflow_items_required_text'),
          payerRequired: t('inflow_payer_required_text'),
          receiptSize: t('inflow_receipt_size_text'),
          receiptType: t('inflow_receipt_type_text'),
        },
        officialExchangeRate
      ),
    [destinationAccounts, functionalCurrencyCode, officialExchangeRate, t]
  );
}
