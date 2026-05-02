import { RequestPasswordResetFormContainer } from '@/auth/ui/containers/request-password-reset-form-container';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function RequestPasswordResetRoute() {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');

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
          <RequestPasswordResetFormContainer />
        </div>
      </div>
    </div>
  );
}
