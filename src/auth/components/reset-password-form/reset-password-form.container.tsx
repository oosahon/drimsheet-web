import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from '@/auth/components/reset-password-form';
import useResetPassword from '@/auth/hooks/use-reset-password';
import authService from '@/auth/lib/auth.service';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import type { IApiValidationError } from '@/shared/utils/api/Api';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

type TSubmitHandler = ResetPasswordFormProps['onSubmit'];

export function ResetPasswordFormContainer() {
  const handleApiError = useApiErrorHandler();
  const { t } = useTranslation(['auth']);
  const password_reset_success_text = t('password_reset_success_text');

  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const email = useMemo(
    () => authService.decodeToken(token)?.email ?? '',
    [token]
  );

  const handleSubmit: TSubmitHandler = async (values, helpers) => {
    try {
      await resetPassword({
        ...values,
        token,
      });
      toast.success(password_reset_success_text);
      navigate('/dashboard');
    } catch (error) {
      const setValidationError = (errors: IApiValidationError[]) => {
        errors.forEach((err) => {
          helpers.setFieldError(err.field, err.message);
        });
      };

      handleApiError(error, {
        showToast: true,
        setValidationError,
      });
    }
  };

  return (
    <ResetPasswordForm
      email={email}
      onSubmit={handleSubmit}
      loading={isPending}
    />
  );
}
