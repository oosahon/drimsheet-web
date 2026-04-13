import { RequestPasswordResetFormContainer } from '@/auth/components/request-password-reset-form';
import { Link } from 'react-router-dom';

export default function RequestPasswordResetRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex w-full min-w-xs flex-col gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Link to="/" className="flex flex-col items-center gap-2 font-medium">
            <div className="flex size-8 items-center justify-center rounded-md mb-8">
              <img
                src="/logo.svg"
                alt="Purple Ledger Limited"
                className="mb-6 min-w-12 rounded-2xl"
              />
            </div>
            <span className="sr-only">Purple Ledger Limited.</span>
          </Link>
        </div>
        <div>
          <RequestPasswordResetFormContainer />
        </div>
      </div>
    </div>
  );
}
