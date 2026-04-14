import { ResetPasswordRequestSuccess } from '@/auth/ui/reset-password-request-success';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { Button } from '@/shared/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/ui/field';
import { Input } from '@/shared/ui/input';
import { cn } from '@/shared/ui/utils';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import * as yup from 'yup';

export interface IResetPasswordRequestFormValues {
  email: string;
}

interface IResetPasswordRequestFormProps extends Omit<
  ComponentProps<'div'>,
  'onSubmit'
> {
  onSubmit: (values: IResetPasswordRequestFormValues) => void;
  loading: boolean;
  isSuccess: boolean;
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

export function ResetPasswordRequestForm({
  className,
  onSubmit,
  loading,
  isSuccess,
  ...props
}: IResetPasswordRequestFormProps) {
  const formik = useFormik<IResetPasswordRequestFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  if (isSuccess) {
    return (
      <ResetPasswordRequestSuccess
        loading={loading}
        retry={formik.handleSubmit}
      />
    );
  }

  return (
    <div className={cn('flex flex-col gap-6 max-w-sm', className)} {...props}>
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
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading} className="w-full">
              Get password reset link
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
