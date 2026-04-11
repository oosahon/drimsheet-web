import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { GoogleIcon } from '@/shared/icons/google';
import { Button } from '@/shared/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/ui/field';
import { Input, PasswordInput } from '@/shared/ui/input';
import { cn } from '@/shared/ui/utils';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

export interface ILoginFormValues {
  email: string;
  password: string;
}

interface ILoginFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: (values: ILoginFormValues) => void;
  loading: boolean;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

export function LoginForm({
  className,
  onSubmit,
  loading,
  ...props
}: ILoginFormProps) {
  const formik = useFormik<ILoginFormValues>({
    initialValues: {
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
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              to="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <img
                  src="/logo.svg"
                  alt="Purple Ledger Limited"
                  className="min-w-12 rounded-2xl mb-6"
                />
              </div>
              <span className="sr-only">Purple Ledger Limited.</span>
            </Link>
          </div>
          <Field className="grid gap-4">
            <Button variant="outline" type="button">
              <GoogleIcon />
              Sign in with Google
            </Button>
          </Field>

          <FieldSeparator className="my-4">Or</FieldSeparator>

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

            <div className="mt-2 text-left">
              <div className="flex justify-between items-center w-full">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Link
                  to="#"
                  className="text-xs font-medium hover:text-purple-200"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-2">
                <PasswordInput
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FieldError errors={getErrorMessage('password')} />
              </div>
            </div>
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading}>
              Sign In
            </Button>
          </Field>
          <FieldDescription>
            Don't have an account?{' '}
            <Link
              to="/auth/signup"
              className="text-purple-400 hover:text-purple-200"
            >
              Sign up
            </Link>
          </FieldDescription>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-xs">
        By signing in, you agree to our{' '}
        <a
          href="https://purpleledger.com/terms-of-service"
          className="text-xs hover:text-purple-500"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          href="https://purpleledger.com/privacy-policy"
          className="text-xs hover:text-purple-500"
        >
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
