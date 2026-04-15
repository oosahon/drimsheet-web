import useVerifyEmail from '@/auth/hooks/use-verify-email';
import FullPageLoader from '@/shared/ui/full-page-loader';
import { handleApiError } from '@/shared/utils/api/errors';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CompleteSignupRoute() {
  const { mutateAsync: verifyEmail } = useVerifyEmail();
  const navigate = useNavigate();

  // NB: put here to prevent double trigger in development
  const hasCalled = useRef(false);

  useEffect(() => {
    const handleVerifyEmail = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      const token = new URLSearchParams(window.location.search).get('token');
      if (token) {
        try {
          await verifyEmail(token);
          toast.success('Email verified successfully');
          navigate('/dashboard');
        } catch (error) {
          handleApiError(error, { showToast: true });
          navigate('/auth/signup');
        }
      }
    };

    handleVerifyEmail();
  }, [verifyEmail, navigate]);

  return <FullPageLoader />;
}
