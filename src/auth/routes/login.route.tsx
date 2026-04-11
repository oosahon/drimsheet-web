import { LoginFormContainer } from '@/auth/components/login-form';

export default function LoginRoute() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <LoginFormContainer />
      </div>
    </div>
  );
}
