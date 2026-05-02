import useResetPasswordFormValidation from '@/auth/hooks/use-reset-password-form-validation';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { cn } from '@/shared/ui/utils';
import { useFormik, type FormikHelpers } from 'formik';
import { type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

export interface IResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

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
}: ResetPasswordFormProps) {
  const { t } = useTranslation();

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

  const email_label = t('auth:email_label');
  const new_password_label = t('auth:new_password_label');
  const confirm_password_label = t('auth:confirm_password_label');
  const reset_password_text = t('auth:reset_password_text');

  return (
    <div
      className={cn('flex flex-col gap-6 min-w-sm max-w-full', className)}
      {...props}
    >
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup>
          <Field>
            <div>
              <FieldLabel htmlFor="email">{email_label}</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                disabled
                value={email}
              />
            </div>

            <div className="mt-2">
              <FieldLabel htmlFor="password">{new_password_label}</FieldLabel>
              <PasswordInput
                id="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('password')} />
            </div>

            <div className="mt-2">
              <FieldLabel htmlFor="confirmPassword">
                {confirm_password_label}
              </FieldLabel>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('confirmPassword')} />
            </div>
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading} className="w-full">
              {reset_password_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
