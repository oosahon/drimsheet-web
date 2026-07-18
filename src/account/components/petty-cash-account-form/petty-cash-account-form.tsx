import { Button } from '@/shared/components/button';
import { CurrencySelect } from '@/shared/components/currency-select';
import { Field, FieldError, FieldGroup } from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { MoneyInput } from '@/shared/components/money-input';
import useCurrencies from '@/shared/hooks/use-currencies';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import usePettyCashAccountFormValidation from './validation';

export interface IPettyCashAccountFormValues {
  name: string;
  currencyCode: string;
  openingBalance: number;
}

export interface IPettyCashAccountFormProps {
  onSubmit: (values: IPettyCashAccountFormValues) => void;
  loading: boolean;
}

const initialValues: IPettyCashAccountFormValues = {
  name: '',
  currencyCode: '',
  openingBalance: 0,
};

export function PettyCashAccountForm({
  onSubmit,
  loading,
}: IPettyCashAccountFormProps) {
  const { data: currencies = [] } = useCurrencies();
  const validationSchema = usePettyCashAccountFormValidation();

  const { handleChange, values, setFieldValue, handleSubmit, errors, touched } =
    useFormik<IPettyCashAccountFormValues>({
      initialValues,
      validationSchema,
      onSubmit,
    });

  const getErrorMessage = useFieldErrorMessage({
    errors,
    touched,
  });

  const { t } = useTranslation(['ledger-accounts']);
  const petty_cash_name_label = t('petty_cash_name_label');
  const currency_label = t('currency_label');
  const starting_balance_label = t('starting_balance_label');
  const save_cash_account_text = t('save_cash_account_text');

  return (
    <div className="w-xs max-w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">{petty_cash_name_label}</Label>
            <Input id="name" onChange={handleChange} value={values.name} />
            <FieldError errors={getErrorMessage('name')} />
          </Field>

          <div className="grid grid-cols-[2fr_3fr]  gap-x-3">
            <CurrencySelect
              label={currency_label}
              value={values.currencyCode}
              currencies={currencies}
              onChange={(val) => setFieldValue('currencyCode', val)}
              error={getErrorMessage('currencyCode')}
              displayCode
            />

            <Field>
              <Label htmlFor="openingBalance">{starting_balance_label}</Label>
              <MoneyInput
                id="openingBalance"
                currencyCode={values.currencyCode}
                onChange={handleChange}
                value={values.openingBalance}
              />
              <FieldError errors={getErrorMessage('openingBalance')} />
            </Field>
          </div>

          <Field className="mt-2">
            <Button type="submit" loading={loading}>
              {save_cash_account_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
