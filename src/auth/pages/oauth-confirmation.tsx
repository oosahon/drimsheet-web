import { authService } from '@/auth/lib/services/auth.service';
import { FullPageLoader } from '@/shared/components/full-page-loader';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function OAuthConfirmationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');

    if (accessToken) {
      authService.setToken(accessToken);
      navigate('/dashboard');
    }
  }, [searchParams, navigate]);

  return <FullPageLoader />;
}
