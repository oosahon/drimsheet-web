import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input, PasswordInput } from '@/shared/ui/input';
import { cn } from '@/shared/ui/utils';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import * as yup from 'yup';

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

const validationSchema = yup.object({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/(?=.*[0-9])/, 'Password must contain at least one number')
    .matches(
      /(?=.*[^A-Za-z0-9])/,
      'Password must contain at least one special character'
    )
    .required('Password is required'),
});

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
    validationSchema: validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <form onSubmit={formik.handleSubmit}>
        <FieldGroup>
          <Field className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <FieldLabel htmlFor="firstName">First name</FieldLabel>
              <Input
                id="firstName"
                name="firstName"
                type="text"
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
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('password')} />
            </div>
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading}>
              Create Account
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
