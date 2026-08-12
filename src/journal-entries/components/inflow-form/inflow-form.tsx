import { AccountCombobox } from '@/account/components/account-combobox';
import { Button } from '@/shared/components/button';
import { CurrencyExchangeRateInput } from '@/shared/components/currency-exchange-rate-input';
import { Field, FieldError, FieldGroup } from '@/shared/components/field';
import {
  FreeSoloCombobox,
  type UFreeSoloComboboxValue,
} from '@/shared/components/free-solo-combobox';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MoneyWithCurrencyInput } from '@/shared/components/money-with-currency-input';
import type { IJournalCounterpartyReq } from '@/shared/lib/api/Api';
import { useFormik } from 'formik';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createInflowFormInitialValues } from './helpers/create-inflow-form-initial-values.helper';
import { getInflowFormErrorMessage } from './helpers/get-inflow-form-error-message.helper';
import { isInflowFormExchangeRateRequired } from './helpers/is-inflow-form-exchange-rate-required.helper';
import { normalizeInflowFormValues } from './helpers/normalize-inflow-form-values.helper';
import type { IInflowFormValues, InflowFormProps } from './types';
import { useInflowFormValidation } from './validation';

export function InflowForm({
  destinationAccounts,
  disabled = false,
  functionalCurrencyCode,
  initialValues,
  loading = false,
  onSplit,
  onSubmit,
  payerOptions = [],
  sourceAccounts,
}: Readonly<InflowFormProps>) {
  const { t } = useTranslation<'journal-entries'>('journal-entries');

  const validationSchema = useInflowFormValidation(
    destinationAccounts,
    functionalCurrencyCode
  );

  const resolvedInitialValues = useMemo(
    () =>
      createInflowFormInitialValues(
        initialValues,
        destinationAccounts,
        functionalCurrencyCode
      ),
    [destinationAccounts, functionalCurrencyCode, initialValues]
  );

  const handleSubmit = (values: IInflowFormValues) => {
    const destinationCurrencyCode = destinationAccounts.find(
      (account) => account.id === values.destinationAccountId
    )?.balance.currencyCode;

    onSubmit(
      normalizeInflowFormValues(
        values,
        isInflowFormExchangeRateRequired(
          destinationCurrencyCode,
          functionalCurrencyCode
        )
      )
    );
  };

  const formik = useFormik<IInflowFormValues>({
    enableReinitialize: true,
    initialValues: resolvedInitialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  const selectedAccount = destinationAccounts.find(
    (account) => account.id === formik.values.destinationAccountId
  );

  const destinationCurrencyCode = selectedAccount?.balance.currencyCode ?? '';

  const exchangeRateRequired = isInflowFormExchangeRateRequired(
    destinationCurrencyCode,
    functionalCurrencyCode
  );

  const interactionDisabled = disabled || loading;
  const exchangeRateDisabled = interactionDisabled || !exchangeRateRequired;

  const handleAccountChange = (destinationAccountId: string) => {
    const currencyCode = destinationAccounts.find(
      (account) => account.id === destinationAccountId
    )?.balance.currencyCode;
    const requiresExchangeRate = isInflowFormExchangeRateRequired(
      currencyCode,
      functionalCurrencyCode
    );

    void formik.setValues({
      ...formik.values,
      destinationAccountId,
      amount: {
        ...formik.values.amount,
        currencyCode: currencyCode ?? '',
      },
      exchangeRate: requiresExchangeRate ? formik.values.exchangeRate : '',
    });
    void formik.setFieldTouched('destinationAccountId', true, false);
  };

  const handleCategoryChange = (categoryAccountId: string) => {
    void formik.setFieldValue('categoryAccountId', categoryAccountId);
    void formik.setFieldTouched('categoryAccountId', true, false);
  };

  const handlePayerChange = (
    payer: UFreeSoloComboboxValue<IJournalCounterpartyReq>
  ) => {
    let nextPayer: IJournalCounterpartyReq;

    if (typeof payer === 'string') {
      nextPayer = { name: payer };
    } else if (payer === null) {
      nextPayer = { name: '' };
    } else {
      nextPayer = payer;
    }

    void formik.setFieldValue('payer', nextPayer);
  };

  const handleSplit = () => {
    onSplit?.(normalizeInflowFormValues(formik.values, exchangeRateRequired));
  };

  const accountError = getInflowFormErrorMessage(
    'destinationAccountId',
    formik.touched,
    formik.errors
  );
  const amountError = getInflowFormErrorMessage(
    'amount.amount',
    formik.touched,
    formik.errors
  );
  const categoryError = getInflowFormErrorMessage(
    'categoryAccountId',
    formik.touched,
    formik.errors
  );
  const exchangeRateError = getInflowFormErrorMessage(
    'exchangeRate',
    formik.touched,
    formik.errors
  );
  const payerError = getInflowFormErrorMessage(
    'payer.name',
    formik.touched,
    formik.errors
  );
  const isAmountInvalid = Boolean(amountError.length);
  const isExchangeRateInvalid = Boolean(exchangeRateError.length);

  const account_label = t('inflow_account_label');
  const amount_label = t('amount_label');
  const category_label = t('category_label');
  const create_text = t('inflow_create_text');
  const description_label = t('description_label');
  const description_placeholder = t('description_placeholder');
  const exchange_rate_label = t('exchange_rate_label');
  const payer_empty_text = t('inflow_payer_empty_text');
  const payer_label = t('inflow_payer_label');
  const payer_placeholder = t('inflow_payer_placeholder');
  const split_transaction_text = t('inflow_split_transaction_text');

  return (
    <form
      aria-busy={loading}
      className="w-full max-w-xl"
      onSubmit={formik.handleSubmit}
    >
      <FieldGroup className="gap-5">
        <AccountCombobox
          id="inflow-destination-account"
          accounts={destinationAccounts}
          disabled={interactionDisabled}
          error={accountError}
          label={account_label}
          onChange={handleAccountChange}
          value={formik.values.destinationAccountId}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field data-invalid={isAmountInvalid}>
            <Label htmlFor="inflow-amount">{amount_label}</Label>
            <MoneyWithCurrencyInput
              id="inflow-amount"
              aria-describedby={
                isAmountInvalid ? 'inflow-amount-error' : undefined
              }
              aria-invalid={isAmountInvalid}
              currencyDisabled
              disabled={interactionDisabled}
              name="amount.amount"
              onBlur={formik.handleBlur}
              onChange={(amount) => void formik.setFieldValue('amount', amount)}
              value={formik.values.amount}
            />
            <FieldError id="inflow-amount-error" errors={amountError} />
          </Field>

          <Field data-invalid={isExchangeRateInvalid}>
            <Label htmlFor="inflow-exchange-rate">{exchange_rate_label}</Label>
            <CurrencyExchangeRateInput
              id="inflow-exchange-rate"
              aria-describedby={
                isExchangeRateInvalid ? 'inflow-exchange-rate-error' : undefined
              }
              aria-invalid={isExchangeRateInvalid}
              aria-label={exchange_rate_label}
              baseCurrency={destinationCurrencyCode}
              disabled={exchangeRateDisabled}
              layout="compact"
              name="exchangeRate"
              onBlur={formik.handleBlur}
              onChange={(event) =>
                void formik.setFieldValue('exchangeRate', event.target.value)
              }
              targetCurrency={functionalCurrencyCode}
              value={exchangeRateRequired ? formik.values.exchangeRate : ''}
            />
            <FieldError
              id="inflow-exchange-rate-error"
              errors={exchangeRateError}
            />
          </Field>
        </div>

        <AccountCombobox
          id="inflow-category"
          accounts={sourceAccounts}
          disabled={interactionDisabled}
          error={categoryError}
          label={category_label}
          onChange={handleCategoryChange}
          value={formik.values.categoryAccountId}
        />

        <FreeSoloCombobox<IJournalCounterpartyReq>
          id="inflow-payer"
          disabled={interactionDisabled}
          emptyMessage={payer_empty_text}
          error={payerError}
          getOptionLabel={(payer) => payer.name}
          isOptionEqualToValue={(payer, value) =>
            payer.id !== undefined && payer.id === value.id
          }
          label={payer_label}
          name="payer.name"
          onBlur={() => void formik.setFieldTouched('payer.name', true)}
          onValueChange={handlePayerChange}
          options={payerOptions}
          placeholder={payer_placeholder}
          required
          value={formik.values.payer}
        />

        <Field>
          <Label htmlFor="inflow-description">{description_label}</Label>
          <Input
            id="inflow-description"
            disabled={interactionDisabled}
            name="description"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder={description_placeholder}
            value={formik.values.description}
          />
        </Field>

        <div className="flex justify-start">
          <Button
            className="h-auto px-0"
            disabled={interactionDisabled}
            onClick={handleSplit}
            type="button"
            variant="link"
          >
            {split_transaction_text}
          </Button>
        </div>

        <div className="flex justify-end pt-2">
          <Button disabled={disabled} loading={loading} type="submit">
            {create_text}
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
