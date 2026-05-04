import useLoginWithEmail from '@/auth/hooks/api/use-login-with-email';
import {
  LoginForm,
  type ILoginFormValues,
} from '@/auth/ui/components/login-form';
import useApiErrorHandler from '@/shared/hooks/use-api-error-handler';
import { useNavigate } from 'react-router-dom';

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
