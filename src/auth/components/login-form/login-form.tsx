import { Button } from '@/shared/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/field';
import { Input } from '@/shared/components/input';
import { PasswordInput } from '@/shared/components/password-input';
import useFieldErrorMessage from '@/shared/hooks/use-field-error-message';
import { cn } from '@/shared/lib/cn';
import { useFormik } from 'formik';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import type { ILoginFormValues } from './types';
import useLoginFormValidation from './validation';

interface ILoginFormProps extends Omit<ComponentProps<'div'>, 'onSubmit'> {
  onSubmit: (values: ILoginFormValues) => void;
  loading: boolean;
}

export function LoginForm({
  className,
  onSubmit,
  loading,
  ...props
}: ILoginFormProps) {
  const { t } = useTranslation('auth');

  const validationSchema = useLoginFormValidation();

  const formik = useFormik<ILoginFormValues>({
    initialValues: {
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

  const email_label = t('email_label');
  const password_label = t('password_label');
  const forgot_password_text = t('forgot_password_text');
  const sign_in_text = t('sign_in_text');

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
                {password_label}
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
                {forgot_password_text}
              </Link>
            </div>
          </Field>
          <Field className="mt-2">
            <Button
              type="submit"
              data-testid="login-submit-btn"
              loading={loading}
            >
              {sign_in_text}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
