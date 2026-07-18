import { AuthConsent } from '@/auth/components/auth-consent';
import { GoogleAuthButton } from '@/auth/components/google-auth-button';
import { SignupForm } from '@/auth/components/signup-form';
import type { ISignupFormValues } from '@/auth/components/signup-form/types';
import useSignupWithEmail from '@/auth/hooks/use-signup-with-email';
import emailSentImg from '@/shared/assets/email-sent.svg';
import logoImg from '@/shared/assets/logo.svg';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/card';
import { FieldDescription, FieldSeparator } from '@/shared/components/field';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const handleApiError = useApiErrorHandler();
  const { t } = useTranslation('auth');
  const { t: tShared } = useTranslation('shared');

  const account_created_success_text = t('account_created_success_text');

  const [, setSearchParams] = useSearchParams();

  const { mutateAsync: signup, isPending } = useSignupWithEmail();

  const handleSignup = async (values: ISignupFormValues) => {
    try {
      await signup(values);
      toast.success(account_created_success_text);
      setSearchParams({ success: 'true' });
    } catch (error) {
      handleApiError(error, { showToast: true });
    }
  };

  const success = useMemo(
    () => searchParams.get('success') === 'true',
    [searchParams]
  );

  const account_created_success_title = t('account_created_success_title');
  const check_email_verification_text = t('check_email_verification_text');
  const or_text = t('or_text');
  const already_have_account_text = t('already_have_account_text');
  const sign_in_link_text = t('sign_in_link_text');
  const creating_an_account_action_text = t('creating_an_account_action_text');
  const purple_ledger_limited = tShared('purple_ledger_limited');

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

        <SignupForm onSubmit={handleSignup} loading={isPending} />

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
