import useLoginWithEmail from '@/auth/hooks/use-login-with-email';
import { LoginForm, type ILoginFormValues } from '@/auth/ui/login-form';
import { handleApiError } from '@/shared/utils/api/errors';
import { useNavigate } from 'react-router-dom';

export function LoginFormContainer() {
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
