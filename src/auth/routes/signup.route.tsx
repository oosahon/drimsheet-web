import { AuthConsent } from '@/auth/ui/auth-consent';
import { GoogleAuthButton } from '@/auth/ui/containers/google-auth-button';
import { SignupFormContainer } from '@/auth/ui/containers/signup-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { FieldDescription, FieldSeparator } from '@/shared/ui/field';
import { useMemo } from 'react';

import emailSentImg from '@/shared/assets/email-sent.svg';
import logoImg from '@/shared/assets/logo.svg';
import { Link, useSearchParams } from 'react-router-dom';

export default function SignupRoute() {
  const [searchParams] = useSearchParams();

  const success = useMemo(
    () => searchParams.get('success') === 'true',
    [searchParams]
  );

  if (success) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card>
          <CardHeader className="flex flex-col items-center gap-4">
            <img src={emailSentImg} alt="Email Sent" />
            <CardTitle>Account created successfully!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p>Please check your email for a verification link</p>
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
                alt="Purple Ledger Limited"
                className="mb-6 min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">Purple Ledger Limited.</span>
          </Link>
        </div>

        <div className="grid gap-4">
          <GoogleAuthButton />
        </div>

        <FieldSeparator className="my-4">Or</FieldSeparator>

        <SignupFormContainer />

        <FieldDescription className="text-center">
          Already have an account?{' '}
          <Link
            to="/auth/signin"
            className="text-purple-600 hover:text-purple-500"
          >
            Sign in
          </Link>
        </FieldDescription>

        <AuthConsent actionText="creating an account" />
      </div>
    </div>
  );
}
