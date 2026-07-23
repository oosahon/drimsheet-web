import {
  ResetPasswordForm,
  type ResetPasswordFormProps,
} from '@/auth/components/reset-password-form';
import { useResetPassword } from '@/auth/hooks/use-reset-password';
import { authService } from '@/auth/lib/auth.service';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import type { IApiValidationError } from '@/shared/lib/api/Api';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');
  const navigate = useNavigate();
  const handleApiError = useApiErrorHandler();

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const email = useMemo(
    () => authService.decodeToken(token)?.email ?? '',
    [token]
  );

  const handleSubmit: ResetPasswordFormProps['onSubmit'] = async (
    values,
    helpers
  ) => {
    try {
      await resetPassword({
        ...values,
        token,
      });
      toast.success(t('password_reset_success_text'));
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

  const reset_password_title = t('reset_password_title');
  const purple_ledger_limited = tShared('purple_ledger_limited');

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full min-w-xs flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <img
                src="/logo.svg"
                alt={purple_ledger_limited}
                className="mb-6 min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">{purple_ledger_limited}.</span>
          </Link>
        </div>
        <h1 className="text-2xl/4 font-bold tracking-tight">
          {reset_password_title}
        </h1>
        <div>
          <ResetPasswordForm
            email={email}
            onSubmit={handleSubmit}
            loading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
