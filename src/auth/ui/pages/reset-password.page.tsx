import { ResetPasswordFormContainer } from '@/auth/ui/containers/reset-password-form-container';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function ResetPasswordPage() {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');

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
          <ResetPasswordFormContainer />
        </div>
      </div>
    </div>
  );
}
