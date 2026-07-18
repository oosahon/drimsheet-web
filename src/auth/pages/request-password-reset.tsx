import { RequestPasswordResetForm } from '@/auth/components/request-password-reset-form';
import type { IRequestPasswordResetFormValues } from '@/auth/components/request-password-reset-form/types';
import useRequestPasswordReset from '@/auth/hooks/use-request-password-reset';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function RequestPasswordResetPage() {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');

  const handleApiError = useApiErrorHandler();
  const password_reset_link_sent_text = t('password_reset_link_sent_text');

  const {
    mutateAsync: requestPasswordReset,
    isPending,
    isSuccess,
  } = useRequestPasswordReset();

  const handleRequestReset = async (
    values: IRequestPasswordResetFormValues
  ) => {
    try {
      await requestPasswordReset(values.email);
      toast.success(password_reset_link_sent_text);
    } catch (error) {
      handleApiError(error, {
        showToast: true,
      });
    }
  };

  const reset_password_title = t('reset_password_title');
  const reset_password_description = t('reset_password_description');
  const purple_ledger_limited = tShared('purple_ledger_limited');

  return (
    <div className="flex h-screen w-full max-w-xs items-center justify-center">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md mb-1">
              <img
                src="/logo.svg"
                alt={purple_ledger_limited}
                className="min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">{purple_ledger_limited}.</span>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl/4 font-bold tracking-tight">
            {reset_password_title}
          </h1>
          <p className="text-sm/6 text-muted-foreground">
            {reset_password_description}
          </p>
        </div>
        <div>
          <RequestPasswordResetForm
            onSubmit={handleRequestReset}
            loading={isPending}
            isSuccess={isSuccess}
          />
        </div>
      </div>
    </div>
  );
}
