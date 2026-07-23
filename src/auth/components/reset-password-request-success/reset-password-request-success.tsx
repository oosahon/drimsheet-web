import { Button } from '@/shared/components/button';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface RequestPasswordResetSuccessProps {
  retry: () => void;
  loading: boolean;
}

export const RequestPasswordResetSuccess = ({
  retry,
  loading,
}: RequestPasswordResetSuccessProps) => {
  const { t } = useTranslation(['auth']);

  const [countdown, setCountdown] = useState<number>(30);

  const handleRetryClick = () => {
    retry();
    setCountdown(30);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const didnt_receive_it_text = t('didnt_receive_it_text');
  const retry_text = t('retry_text');
  const back_to_sign_in_text = t('back_to_sign_in_text');
  const retry_in_text = t('auth:retry_in_text', { countdown });

  return (
    <div className="flex flex-col gap-4 text-center max-w-sm">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-muted-foreground">{didnt_receive_it_text}</p>
        <Button
          type="button"
          onClick={handleRetryClick}
          loading={loading}
          disabled={countdown > 0}
          className="w-full"
        >
          {countdown > 0 ? retry_in_text : retry_text}
        </Button>
      </div>

      <Link
        to="/auth/signin"
        className="text-sm font-medium text-purple-400 hover:text-purple-200"
      >
        {back_to_sign_in_text}
      </Link>
    </div>
  );
};
