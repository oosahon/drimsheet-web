import { signupFormValidation } from '@/auth/ui/validations/signup-form.validations';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { PasswordInput } from '@/shared/ui/password-input';
import { cn } from '@/shared/ui/utils';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';

export interface ISignupFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface ISignupFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: (values: ISignupFormValues) => void;
  loading: boolean;
}

export function SignupForm({
  className,
  onSubmit,
  loading,
  ...props
}: ISignupFormProps) {
  const formik = useFormik<ISignupFormValues>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    validationSchema: signupFormValidation,
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
          <Field className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
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
              <FieldLabel htmlFor="lastName">Last name</FieldLabel>
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
              <FieldLabel htmlFor="email">Email</FieldLabel>
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
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
              Create account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
