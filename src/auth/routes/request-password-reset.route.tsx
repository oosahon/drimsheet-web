import { ResetPasswordRequestFormContainer } from '@/auth/components/request-password-reset-form-container';
import { Link } from 'react-router-dom';

export default function RequestPasswordResetRoute() {
  return (
    <div className="flex h-screen w-full max-w-xs items-center justify-center">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md mb-1">
              <img
                src="/logo.svg"
                alt="Purple Ledger Limited"
                className="min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">Purple Ledger Limited.</span>
          </Link>
        </div>
        <div>
          <h1 className="text-2xl/4 font-bold tracking-tight">
            Reset your password
          </h1>
          <p className="text-sm/6 text-muted-foreground">
            A password reset link will be sent to the email address associated
            with your account.
          </p>
        </div>
        <div>
          <ResetPasswordRequestFormContainer />
        </div>
      </div>
    </div>
  );
}
