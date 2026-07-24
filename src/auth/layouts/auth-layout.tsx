import { authService } from '@/auth/lib/services/auth.service';
import { useMemo } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export function AuthLayout() {
  const isAuthenticated = useMemo(() => authService.isLoggedIn(), []);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center">
      <Outlet />
    </div>
  );
}
