import { RequestPasswordResetSuccess } from '@/auth/components/reset-password-request-success';
import { Button } from '@/shared/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { useFieldErrorMessage } from '@/shared/hooks/use-field-error-message';
import { cn } from '@/shared/lib/cn';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import type { IRequestPasswordResetFormValues } from './types';
import { useRequestPasswordResetFormValidation } from './validation';

interface IRequestPasswordResetFormProps extends Omit<
  ComponentProps<'div'>,
  'onSubmit'
> {
  onSubmit: (values: IRequestPasswordResetFormValues) => void;
  loading: boolean;
  isSuccess: boolean;
}

export function RequestPasswordResetForm({
  className,
  onSubmit,
  loading,
  isSuccess,
  ...props
}: Readonly<IRequestPasswordResetFormProps>) {
  const { t } = useTranslation('auth');

  const validationSchema = useRequestPasswordResetFormValidation();

  const formik = useFormik<IRequestPasswordResetFormValues>({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit,
  });

  const getErrorMessage = useFieldErrorMessage({
    errors: formik.errors,
    touched: formik.touched,
  });

  const email_label = t('email_label');
  const get_password_reset_link_text = t('get_password_reset_link_text');

  if (isSuccess) {
    return (
      <RequestPasswordResetSuccess
        loading={loading}
        retry={formik.handleSubmit}
      />
    );
  }

  return (
    <div
      className={cn('flex flex-col gap-6 max-w-full min-w-xs', className)}
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
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <FieldError errors={getErrorMessage('email')} />
            </div>
          </Field>
          <Field className="mt-2">
            <Button type="submit" loading={loading} className="w-full">
              {get_password_reset_link_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
