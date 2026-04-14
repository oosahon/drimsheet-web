import { RequestPasswordResetFormContainer } from '@/auth/components/request-password-reset-form';
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
          <p className="text-sm text-muted-foreground">
            Enter your user account's verified email address and we will send
            you a password reset link.
          </p>
        </div>
        <div>
          <RequestPasswordResetFormContainer />
        </div>
      </div>
    </div>
  );
}
