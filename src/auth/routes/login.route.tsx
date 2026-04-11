import { GoogleAuthButton } from '@/auth/components/google-auth-button';
import { LoginFormContainer } from '@/auth/components/login-form';
import { AuthConsent } from '@/auth/ui/auth-consent';
import { FieldDescription, FieldSeparator } from '@/shared/ui/field';
import { Link } from 'react-router-dom';

export default function LoginRoute() {
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
          <GoogleAuthButton>Sign in with Google</GoogleAuthButton>
        </div>

        <FieldSeparator className="my-4">Or</FieldSeparator>

        <LoginFormContainer />

        <FieldDescription className="text-center">
          Don't have an account?{' '}
          <Link
            to="/auth/signup"
            className="text-purple-400 hover:text-purple-200"
          >
            Sign up
          </Link>
        </FieldDescription>

        <AuthConsent actionText="signing in" />
      </div>
    </div>
  );
}
