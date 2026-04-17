import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('email')} />
            </div>

            <div className="mt-2 grid grid-cols-[1fr_auto] items-center text-left">
              <FieldLabel
                htmlFor="password"
                className="col-start-1 row-start-1"
              >
                Password
              </FieldLabel>
              <div className="col-span-2 row-start-2 mt-2">
                <PasswordInput
                  id="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <FieldError errors={getErrorMessage('password')} />
              </div>
              <Link
                to="/auth/forgot-password"
                className="col-start-2 row-start-1 justify-self-end text-xs font-medium hover:text-purple-200"
              >
                Forgot password?
              </Link>
            </div>
          </Field>
          <Field className="mt-2">
            <Button
              type="submit"
              data-testid="login-submit-btn"
              loading={loading}
            >
              Sign In
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
