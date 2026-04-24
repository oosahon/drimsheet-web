import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { cn } from '@/shared/ui/utils';
import { useFormik, type FormikHelpers } from 'formik';
import { type ComponentProps } from 'react';
import * as yup from 'yup';

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

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
    .matches(
      /(?=.*[^A-Za-z0-9])/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export function ResetPasswordForm({
  className,
  email,
  onSubmit,
  loading,
  ...props
}: ResetPasswordFormProps) {
  const formik = useFormik<IResetPasswordFormValues>({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  return (
    <div
      className={cn('flex flex-col gap-6 min-w-sm max-w-full', className)}
      {...props}
    >
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup>
          <Field>
            <div>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                disabled
                value={email}
              />
            </div>

            <div className="mt-2">
              <FieldLabel htmlFor="password">New Password</FieldLabel>
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
                Confirm Password
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
              Reset password
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
