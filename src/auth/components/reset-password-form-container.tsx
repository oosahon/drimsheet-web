import useResetPassword from '@/auth/hooks/use-reset-password';
import authService from '@/auth/services/auth.service';
import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from '@/auth/ui/reset-password-form';
import type { IApiValidationError } from '@/shared/utils/api/Api';
import { handleApiError } from '@/shared/utils/api/errors';

import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

type TSubmitHandler = ResetPasswordFormProps['onSubmit'];

export function ResetPasswordFormContainer() {
  const { mutateAsync: resetPassword, isPending } = useResetPassword();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const email = useMemo(() => authService.decodeToken(token)?.email, [token]);

  const handleSubmit: TSubmitHandler = async (values, helpers) => {
    try {
      await resetPassword({
        ...values,
        token,
      });
      toast.success('Password has been reset successfully.');
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
