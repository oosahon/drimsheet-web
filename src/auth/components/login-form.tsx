import { LoginForm, type ILoginFormValues } from '@/auth/ui/login-form';
import { useState } from 'react';
import { toast } from 'sonner';

export function LoginFormContainer() {
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async (values: ILoginFormValues) => {
    setIsPending(true);
    try {
      // TODO: Implement actual login when API is ready
      console.log('Login values:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Logged in successfully (Mock)');
    } catch {
      toast.error('Login failed');
    } finally {
      setIsPending(false);
    }
  };

  return <LoginForm onSubmit={handleLogin} loading={isPending} />;
}
