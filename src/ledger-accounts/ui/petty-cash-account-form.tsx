import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { CurrencySelect } from '@/shared/ui/currency-select';
import { Field, FieldError, FieldGroup } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
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
    <div className="w-sm max-w-full">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Petty Cash Name</Label>
            <Input id="name" onChange={handleChange} value={values.name} />
            <FieldError errors={getErrorMessage('name')} />
          </Field>

          <CurrencySelect
            label="Currency"
            value={values.currencyCode}
            onChange={(val) => setFieldValue('currencyCode', val)}
            error={getErrorMessage('currencyCode')}
          />

          <Field>
            <Label htmlFor="openingBalance">Starting balance</Label>
            <Input
              id="openingBalance"
              type="number"
              onChange={handleChange}
              value={values.openingBalance}
            />
            <FieldError errors={getErrorMessage('openingBalance')} />
          </Field>

          <Field className="mt-2">
            <Button type="submit" loading={loading}>
              Create account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
