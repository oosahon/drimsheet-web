import { GoogleAuthButton } from '@/auth/components/google-auth-button';
import { SignupFormContainer } from '@/auth/components/signup-form';
import { AuthConsent } from '@/auth/ui/auth-consent';
import { FieldDescription, FieldSeparator } from '@/shared/ui/field';
import { Link } from 'react-router-dom';

export default function SignupRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md">
              <img
                src="/logo.svg"
                alt="Purple Ledger Limited"
                className="mb-6 min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">Purple Ledger Limited.</span>
          </Link>
        </div>

        <div className="grid gap-4">
          <GoogleAuthButton>Continue with Google</GoogleAuthButton>
        </div>

        <FieldSeparator className="my-4">Or</FieldSeparator>

        <SignupFormContainer />

        <FieldDescription className="text-center">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="text-purple-600 hover:text-purple-500"
          >
            Sign in
          </Link>
        </FieldDescription>

        <AuthConsent actionText="clicking continue" />
      </div>
    </div>
  );
}
