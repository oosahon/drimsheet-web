import { Button } from '@/shared/ui/button';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface RequestPasswordResetSuccessProps {
  retry: () => void;
  loading: boolean;
}

export const RequestPasswordResetSuccess = ({
  retry,
  loading,
}: RequestPasswordResetSuccessProps) => {
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
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">Didn't receive it?</p>
        <Button
          type="button"
          onClick={handleRetryClick}
          loading={loading}
          disabled={countdown > 0}
          className="w-full"
        >
          {countdown > 0 ? `Retry in ${countdown}s` : 'Retry'}
        </Button>
      </div>

      <Link
        to="/auth/signin"
        className="text-sm font-medium text-purple-400 hover:text-purple-200"
      >
        Back to sign in
      </Link>
    </div>
  );
};
