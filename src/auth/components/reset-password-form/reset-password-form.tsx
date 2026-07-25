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
import { useFormik, type FormikHelpers } from 'formik';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { IResetPasswordFormValues } from './types';
import { useResetPasswordFormValidation } from './validation';

export interface ResetPasswordFormProps extends Omit<
  ComponentProps<'div'>,
  'onSubmit'
> {
  email: string;
  onSubmit: (
    values: IResetPasswordFormValues,
    helpers: FormikHelpers<IResetPasswordFormValues>
  ) => void | Promise<void>;
  loading: boolean;
}

export function ResetPasswordForm({
  className,
  email,
  onSubmit,
  loading,
  ...props
}: Readonly<ResetPasswordFormProps>) {
  const { t } = useTranslation('auth');

  const validationSchema = useResetPasswordFormValidation();

  const formik = useFormik<IResetPasswordFormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const passwordErrors = getErrorMessage('password');
  const confirmPasswordErrors = getErrorMessage('confirmPassword');

  const passwordInvalid = passwordErrors.length > 0;
  const confirmPasswordInvalid = confirmPasswordErrors.length > 0;

  const email_label = t('email_label');
  const new_password_label = t('new_password_label');
  const confirm_password_label = t('confirm_password_label');
  const reset_password_text = t('reset_password_text');

  return (
    <div
      className={cn('flex flex-col gap-6 w-full min-w-0 max-w-full', className)}
      {...props}
    >
      <form onSubmit={formik.handleSubmit} aria-busy={loading}>
        <FieldGroup>
          <Field>
            <div>
              <FieldLabel htmlFor="email">{email_label}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                disabled
                value={email}
              />
            </div>

            <Field className="mt-2" data-invalid={passwordInvalid || undefined}>
              <FieldLabel htmlFor="password">{new_password_label}</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                disabled={loading}
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={passwordInvalid || undefined}
                aria-describedby={
                  passwordInvalid ? 'password-error' : undefined
                }
              />
              <FieldError id="password-error" errors={passwordErrors} />
            </Field>

            <Field
              className="mt-2"
              data-invalid={confirmPasswordInvalid || undefined}
            >
              <FieldLabel htmlFor="confirmPassword">
                {confirm_password_label}
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                disabled={loading}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                aria-invalid={confirmPasswordInvalid || undefined}
                aria-describedby={
                  confirmPasswordInvalid ? 'confirmPassword-error' : undefined
                }
              />
              <FieldError
                id="confirmPassword-error"
                errors={confirmPasswordErrors}
              />
            </Field>
          </Field>
          <Field className="mt-2">
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
            >
              {reset_password_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
