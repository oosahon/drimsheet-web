import { LoginForm } from '@/auth/components/login-form';
import useLoginWithEmail from '@/auth/hooks/use-login-with-email';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useNavigate } from 'react-router-dom';
import type { ILoginFormValues } from './types';

export function LoginFormContainer() {
  const handleApiError = useApiErrorHandler();
  const { mutateAsync: loginWithEmail, isPending } = useLoginWithEmail();
  const navigate = useNavigate();

  const handleLogin = async (values: ILoginFormValues) => {
    try {
      await loginWithEmail(values);
      navigate('/dashboard');
    } catch (error) {
      handleApiError(error, {
        showToast: true,
      });
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={isPending} />;
}
