import { AccountBehaviorNote } from '@/account/components/account-behavior-note';
import { OpeningBalanceFields } from '@/account/components/opening-balance-fields';
import { Button } from '@/shared/components/button';
import { Checkbox } from '@/shared/components/checkbox';
import { CurrencySelect } from '@/shared/components/currency-select';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSet,
} from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { ELedgerAccountBehavior } from '@/shared/lib/api/Api';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import type { IPettyCashFormValues, PettyCashFormProps } from './types';
import { usePettyCashFormValidation } from './validation';

const defaultInitialValues: IPettyCashFormValues = {
  name: '',
  currencyCode: '',
  createWithoutOpeningBalance: false,
  openingBalance: '',
  openingDate: '',
  exchangeRate: '',
  isSubAccount: false,
};

export function PettyCashForm({
  accountingCurrencyCode,
  currencies,
  initialValues,
  loading = false,
  disabled = false,
  onSubmit,
}: Readonly<PettyCashFormProps>) {
  const { t } = useTranslation<'ledger-accounts'>('ledger-accounts');
  const validationSchema = usePettyCashFormValidation(accountingCurrencyCode);

  const formik = useFormik<IPettyCashFormValues>({
    enableReinitialize: true,
    initialValues: { ...defaultInitialValues, ...initialValues },
    validationSchema,
    onSubmit: (values) => {
      const hasOpeningBalance = !values.createWithoutOpeningBalance;
      const needsExchangeRate =
        hasOpeningBalance && values.currencyCode !== accountingCurrencyCode;

      return onSubmit({
        ...values,
        openingBalance: hasOpeningBalance ? values.openingBalance : '',
        openingDate: hasOpeningBalance ? values.openingDate : '',
        exchangeRate: needsExchangeRate ? values.exchangeRate : '',
      });
    },
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const handleCurrencyChange = (value: string) => {
    void formik.setFieldValue('currencyCode', value);
  };

  const handleCreateWithoutOpeningBalanceChange = (checked: boolean) => {
    void formik.setFieldValue('createWithoutOpeningBalance', checked);
  };

  const handleOpeningDateChange = (value: string) => {
    void formik.setFieldValue('openingDate', value);
  };

  const account_name_label = t('account_name');
  const currency_label = t('currency_label');
  const create_as_sub_account_label = t('create_as_sub_account_label');
  const create_account_text = t('create_account_text');

  return (
    <form
      className="w-full max-w-2xl"
      noValidate
      onSubmit={formik.handleSubmit}
    >
      <FieldSet disabled={disabled || loading}>
        <FieldGroup>
          <Field data-invalid={Boolean(getErrorMessage('name').length)}>
            <Label htmlFor="name">{account_name_label}</Label>
            <Input
              aria-invalid={Boolean(getErrorMessage('name').length)}
              id="name"
              name="name"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FieldError errors={getErrorMessage('name')} />
          </Field>

          <CurrencySelect
            currencies={currencies}
            displayCode
            error={getErrorMessage('currencyCode')}
            label={currency_label}
            onChange={handleCurrencyChange}
            value={formik.values.currencyCode}
          />

          <OpeningBalanceFields
            accountingCurrencyCode={accountingCurrencyCode}
            createWithoutOpeningBalance={
              formik.values.createWithoutOpeningBalance
            }
            currencyCode={formik.values.currencyCode}
            disabled={disabled || loading}
            exchangeRate={formik.values.exchangeRate}
            exchangeRateError={getErrorMessage('exchangeRate')}
            onCreateWithoutOpeningBalanceChange={
              handleCreateWithoutOpeningBalanceChange
            }
            onExchangeRateChange={formik.handleChange}
            onOpeningBalanceChange={formik.handleChange}
            onOpeningDateChange={handleOpeningDateChange}
            openingBalance={formik.values.openingBalance}
            openingBalanceError={getErrorMessage('openingBalance')}
            openingDate={formik.values.openingDate}
            openingDateError={getErrorMessage('openingDate')}
          />

          <Field orientation="horizontal">
            <Checkbox
              aria-label={create_as_sub_account_label}
              checked={formik.values.isSubAccount}
              disabled={disabled || loading}
              id="isSubAccount"
              name="isSubAccount"
              onCheckedChange={(checked) => {
                void formik.setFieldValue('isSubAccount', checked === true);
              }}
            />
            <Label htmlFor="isSubAccount">{create_as_sub_account_label}</Label>
          </Field>

          <AccountBehaviorNote behavior={ELedgerAccountBehavior.PettyCash} />

          <Field>
            <Button
              className="w-full sm:ml-auto sm:w-auto"
              disabled={disabled}
              loading={loading}
              type="submit"
            >
              {create_account_text}
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
