import { SignupFormContainer } from '@/auth/components/signup-form';
import authService from '@/auth/services/auth.service';
import { useMemo } from 'react';
import { Navigate } from 'react-router-dom';

export default function SignupRoute() {
  const isAuthenticated = useMemo(() => authService.isLoggedIn(), []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-sm">
        <SignupFormContainer />
      </div>
    </div>
  );
}
