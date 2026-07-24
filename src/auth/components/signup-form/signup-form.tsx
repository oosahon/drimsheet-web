import { Button } from '@/shared/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { PasswordInput } from '@/shared/components/password-input';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { cn } from '@/shared/lib/utils/cn';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { ISignupFormValues } from './types';
import { useSignupFormValidation } from './validation';

interface ISignupFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: (values: ISignupFormValues) => void;
  loading: boolean;
}

export function SignupForm({
  className,
  onSubmit,
  loading,
  ...props
}: Readonly<ISignupFormProps>) {
  const { t } = useTranslation('auth');

  const validationSchema = useSignupFormValidation();

  const formik = useFormik<ISignupFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const first_name_label = t('first_name_label');
  const last_name_label = t('last_name_label');
  const email_label = t('email_label');
  const password_label = t('password_label');
  const create_account_text = t('create_account_text');

  return (
    <div
      className={cn('flex flex-col gap-6 min-w-sm max-w-full', className)}
      {...props}
    >
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup>
          <Field className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <FieldLabel htmlFor="firstName">{first_name_label}</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('firstName')} />
            </div>
            <div className="flex flex-col">
              <FieldLabel htmlFor="lastName">{last_name_label}</FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('lastName')} />
            </div>
          </Field>

          <Field>
            <div>
              <FieldLabel htmlFor="email">{email_label}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('email')} />
            </div>

            <div className="mt-2">
              <FieldLabel htmlFor="password">{password_label}</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('password')} />
            </div>
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading}>
              {create_account_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
