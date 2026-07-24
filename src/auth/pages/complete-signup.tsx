import { useVerifyEmail } from '@/auth/hooks/use-verify-email';
import { FullPageLoader } from '@/shared/components/full-page-loader';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function CompleteSignUpPage() {
  const handleApiError = useApiErrorHandler();
  const { t } = useTranslation('auth');

  const navigate = useNavigate();

  const hasCalled = useRef(false);

  const { mutateAsync: verifyEmail } = useVerifyEmail();

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        try {
          await verifyEmail(token);

          const email_verified_success_text = t('email_verified_success_text');
          toast.success(email_verified_success_text);
          navigate('/dashboard');
        } catch (error) {
          handleApiError(error, { showToast: true });
          navigate('/auth/signup');
        }
      }
    };

    handleVerifyEmail();
  }, [verifyEmail, navigate, t, handleApiError]);

  return <FullPageLoader />;
}
