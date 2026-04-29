import useCurrencies from '@/shared/hooks/use-currencies';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { CurrencySelect } from '@/shared/ui/currency-select';
import { Field, FieldError, FieldGroup } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { MoneyInput } from '@/shared/ui/money-input';
import { useFormik } from 'formik';
import * as yup from 'yup';

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

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Account name is required')
    .min(3, 'Account name must be at least 3 characters')
    .max(100, 'Account name must not exceed 100 characters'),
  currencyCode: yup.string().required('Currency is required'),
  openingBalance: yup
    .number()
    .required('Opening balance is required')
    .min(0, 'Opening balance cannot be negative'),
});

export function PettyCashAccountForm({
  onSubmit,
  loading,
}: IPettyCashAccountFormProps) {
  const { data: currenciesData = [] } = useCurrencies();
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

  return (
    <div className="w-xs max-w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Petty Cash Name</Label>
            <Input id="name" onChange={handleChange} value={values.name} />
            <FieldError errors={getErrorMessage('name')} />
          </Field>

          <div className="grid grid-cols-[2fr_3fr]  gap-x-3">
            <CurrencySelect
              label="Currency"
              value={values.currencyCode}
              currenciesData={currenciesData}
              onChange={(val) => setFieldValue('currencyCode', val)}
              error={getErrorMessage('currencyCode')}
              displayCode
            />

            <Field>
              <Label htmlFor="openingBalance">Starting balance</Label>
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
              Save cash account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
