import { AuthConsent } from '@/auth/ui/auth-consent';
import { GoogleAuthButton } from '@/auth/ui/containers/google-auth-button';
import { LoginFormContainer } from '@/auth/ui/containers/login-form-container';
import { FieldDescription, FieldSeparator } from '@/shared/ui/field';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function LoginRoute() {
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');

  const or_text = t('or_text');
  const no_account_text = t('no_account_text');
  const sign_up_text = t('sign_up_text');
  const logging_in_action_text = t('logging_in_action_text');
  const purple_ledger_limited = tShared('purple_ledger_limited');

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
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

        <div className="grid gap-4">
          <GoogleAuthButton />
        </div>

        <FieldSeparator className="my-4">{or_text}</FieldSeparator>

        <LoginFormContainer />

        <FieldDescription className="text-center">
          {no_account_text}{' '}
          <Link
            to="/auth/signup"
            className="text-purple-400 hover:text-purple-200"
          >
            {sign_up_text}
          </Link>
        </FieldDescription>

        <AuthConsent actionText={logging_in_action_text} />
      </div>
    </div>
  );
}
