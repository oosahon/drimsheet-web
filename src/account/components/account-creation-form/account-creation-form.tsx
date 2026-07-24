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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/select';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { AccountBehaviorNote } from './parts/account-behavior-note';
import { OpeningBalanceFields } from './parts/opening-balance-fields';
import type {
  AccountCreationFormProps,
  IAccountCreationFormValues,
} from './types';
import { useAccountCreationFormValidation } from './validation';

const defaultInitialValues: IAccountCreationFormValues = {
  name: '',
  accountType: '',
  currencyCode: '',
  createWithoutOpeningBalance: false,
  openingBalance: '',
  openingDate: '',
  exchangeRate: '',
  isSubAccount: false,
};

export function AccountCreationForm({
  accountingCurrencyCode,
  accountTypes,
  currencies,
  initialValues,
  loading = false,
  disabled = false,
  onSubmit,
}: Readonly<AccountCreationFormProps>) {
  const { t } = useTranslation<'ledger-accounts'>('ledger-accounts');
  const validationSchema = useAccountCreationFormValidation(
    accountingCurrencyCode
  );

  const formik = useFormik<IAccountCreationFormValues>({
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

  const handleAccountTypeChange = (value: string) => {
    void formik.setFieldValue('accountType', value);
  };

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
  const account_type_label = t('account_type_label');
  const account_type_placeholder = t('select_account_type_placeholder');
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

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              data-invalid={Boolean(getErrorMessage('accountType').length)}
            >
              <Label htmlFor="accountType">{account_type_label}</Label>
              <Select
                disabled={disabled || loading}
                onValueChange={handleAccountTypeChange}
                value={formik.values.accountType}
              >
                <SelectTrigger
                  aria-invalid={Boolean(getErrorMessage('accountType').length)}
                  className="w-full"
                  id="accountType"
                >
                  <SelectValue placeholder={account_type_placeholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {accountTypes.map((accountType) => (
                      <SelectItem
                        key={accountType.value}
                        value={accountType.value}
                      >
                        {accountType.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError errors={getErrorMessage('accountType')} />
            </Field>

            <CurrencySelect
              currencies={currencies}
              displayCode
              error={getErrorMessage('currencyCode')}
              label={currency_label}
              onChange={handleCurrencyChange}
              value={formik.values.currencyCode}
            />
          </div>

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

          {formik.values.accountType && (
            <AccountBehaviorNote behavior={formik.values.accountType} />
          )}

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
