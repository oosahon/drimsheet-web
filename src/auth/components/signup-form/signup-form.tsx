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

  const firstNameErrors = getErrorMessage('firstName');
  const lastNameErrors = getErrorMessage('lastName');
  const emailErrors = getErrorMessage('email');
  const passwordErrors = getErrorMessage('password');

  const firstNameInvalid = firstNameErrors.length > 0;
  const lastNameInvalid = lastNameErrors.length > 0;
  const emailInvalid = emailErrors.length > 0;
  const passwordInvalid = passwordErrors.length > 0;

  const first_name_label = t('first_name_label');
  const last_name_label = t('last_name_label');
  const email_label = t('email_label');
  const password_label = t('password_label');
  const create_account_text = t('create_account_text');

  return (
    <div
      className={cn('flex w-full min-w-0 max-w-full flex-col gap-6', className)}
      {...props}
    >
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 min-[360px]:grid-cols-2">
            <Field data-invalid={firstNameInvalid}>
              <FieldLabel htmlFor="firstName">{first_name_label}</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={firstNameInvalid || undefined}
                aria-describedby={
                  firstNameInvalid ? 'firstName-error' : undefined
                }
              />
              <FieldError id="firstName-error" errors={firstNameErrors} />
            </Field>
            <Field data-invalid={lastNameInvalid}>
              <FieldLabel htmlFor="lastName">{last_name_label}</FieldLabel>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={lastNameInvalid || undefined}
                aria-describedby={
                  lastNameInvalid ? 'lastName-error' : undefined
                }
              />
              <FieldError id="lastName-error" errors={lastNameErrors} />
            </Field>
          </div>

          <Field data-invalid={emailInvalid}>
            <FieldLabel htmlFor="email">{email_label}</FieldLabel>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={emailInvalid || undefined}
              aria-describedby={emailInvalid ? 'email-error' : undefined}
            />
            <FieldError id="email-error" errors={emailErrors} />
          </Field>

          <Field data-invalid={passwordInvalid}>
            <FieldLabel htmlFor="password">{password_label}</FieldLabel>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={passwordInvalid || undefined}
              aria-describedby={passwordInvalid ? 'password-error' : undefined}
            />
            <FieldError id="password-error" errors={passwordErrors} />
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
