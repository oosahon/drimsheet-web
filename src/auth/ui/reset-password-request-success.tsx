import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ResetPasswordRequestSuccessProps {
  retry: () => void;
  loading: boolean;
}

export const ResetPasswordRequestSuccess = ({
  retry,
  loading,
}: ResetPasswordRequestSuccessProps) => {
  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleRetryClick = () => {
    retry();
    setCountdown(30);
  };

  return (
    <div className="flex flex-col gap-4 text-center max-w-sm">
      <p className="text-sm text-muted-foreground">
        If an account exists for that email, we have sent a password reset link.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Didn't receive it?</p>
        <Button
          type="button"
          onClick={handleRetryClick}
          loading={loading}
          disabled={countdown > 0}
          variant="secondary"
          className="w-full"
        >
          {countdown > 0 ? `Retry in ${countdown}s` : 'Retry'}
        </Button>
      </div>

      <Link
        to="/auth/login"
        className="text-sm font-medium text-purple-400 hover:text-purple-200"
      >
        Back to login
      </Link>
    </div>
  );
};
