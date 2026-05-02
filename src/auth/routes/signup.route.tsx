import { AuthConsent } from '@/auth/ui/auth-consent';
import { GoogleAuthButton } from '@/auth/ui/containers/google-auth-button';
import { SignupFormContainer } from '@/auth/ui/containers/signup-form';
import emailSentImg from '@/shared/assets/email-sent.svg';
import logoImg from '@/shared/assets/logo.svg';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { FieldDescription, FieldSeparator } from '@/shared/ui/field';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';

export default function SignupRoute() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();

  const success = useMemo(
    () => searchParams.get('success') === 'true',
    [searchParams]
  );

  const account_created_success_title = t('auth:account_created_success_title');
  const check_email_verification_text = t('auth:check_email_verification_text');
  const or_text = t('auth:or_text');
  const already_have_account_text = t('auth:already_have_account_text');
  const sign_in_link_text = t('auth:sign_in_link_text');
  const creating_an_account_action_text = t(
    'auth:creating_an_account_action_text'
  );
  const purple_ledger_limited = t('shared:purple_ledger_limited');

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card>
          <CardHeader className="flex flex-col items-center gap-4">
            <img src={emailSentImg} alt="Email Sent" />
            <CardTitle>{account_created_success_title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>{check_email_verification_text}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <img
                src={logoImg}
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

        <SignupFormContainer />

        <FieldDescription className="text-center">
          {already_have_account_text}{' '}
          <Link
            to="/auth/signin"
            className="text-purple-600 hover:text-purple-500"
          >
            {sign_in_link_text}
          </Link>
        </FieldDescription>

        <AuthConsent actionText={creating_an_account_action_text} />
      </div>
    </div>
  );
}
