import { CounterpartyAddressFields } from '@/counterparty/components/counterparty-address-fields';
import { CounterpartyTypeSelect } from '@/counterparty/components/counterparty-type-select';
import { Button } from '@/shared/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldSeparator,
  FieldSet,
} from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { Label } from '@/shared/components/label';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import type { EmployerFormProps, IEmployerFormValues } from './types';
import { useEmployerFormValidation } from './validation';

export function EmployerForm({
  onSubmit,
  initialValues,
  jurisdictions = [],
  loading = false,
  disabled = false,
  className,
}: Readonly<EmployerFormProps>) {
  const { t } = useTranslation(['counterparty']);
  const validationSchema = useEmployerFormValidation();

  const formik = useFormik<IEmployerFormValues>({
    initialValues: {
      name: '',
      type: 'individual',
      displayName: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        region: '',
        countryCode: '',
      },
      ...initialValues,
    } as IEmployerFormValues,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const handleTypeChange = (value: string) => {
    void formik.setFieldValue('type', value);
  };

  const handleAddressChange = (field: string, value: string) => {
    void formik.setFieldValue(field, value);
  };

  const legal_name_label = t('counterparty:legal_name_label');
  const display_name_label =
    t('counterparty:display_name_label') +
    ` ${t('counterparty:optional_suffix')}`;
  const address_section_title = t('counterparty:address_section_title');
  const create_button_label = t('counterparty:create_button_label');

  return (
    <form onSubmit={formik.handleSubmit} className={className} noValidate>
      <FieldSet disabled={disabled || loading}>
        <FieldGroup className="gap-5">
          <Field data-invalid={Boolean(getErrorMessage('name').length)}>
            <Label htmlFor="employer-name">{legal_name_label}</Label>
            <Input
              id="employer-name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getErrorMessage('name').length)}
              disabled={disabled || loading}
            />
            <FieldError errors={getErrorMessage('name')} />
          </Field>

          <CounterpartyTypeSelect
            value={formik.values.type}
            onChange={handleTypeChange}
            error={getErrorMessage('type')}
            disabled={disabled || loading}
          />

          <Field data-invalid={Boolean(getErrorMessage('displayName').length)}>
            <Label htmlFor="employer-display-name">{display_name_label}</Label>
            <Input
              id="employer-display-name"
              name="displayName"
              value={formik.values.displayName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={Boolean(getErrorMessage('displayName').length)}
              disabled={disabled || loading}
            />
            <FieldError errors={getErrorMessage('displayName')} />
          </Field>

          <FieldSeparator className="my-3">
            {address_section_title}
          </FieldSeparator>

          <CounterpartyAddressFields
            values={formik.values.address}
            errors={formik.errors}
            touched={formik.touched}
            jurisdictions={jurisdictions}
            onChange={handleAddressChange}
            onBlur={formik.handleBlur}
            disabled={disabled || loading}
            countryRequired={true}
            showOptionalSuffix={false}
          />

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={disabled || loading}
              className="min-w-[100px]"
            >
              {loading ? t('counterparty:continue') : create_button_label}
            </Button>
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
