import { ResetPasswordFormContainer } from '@/auth/ui/containers/reset-password-form-container';
import { Link } from 'react-router-dom';

export default function ResetPasswordRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full min-w-xs flex-col gap-6">
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
        <h1 className="text-2xl/4 font-bold tracking-tight">
          Reset your password
        </h1>
        <div>
          <ResetPasswordFormContainer />
        </div>
      </div>
    </div>
  );
}
