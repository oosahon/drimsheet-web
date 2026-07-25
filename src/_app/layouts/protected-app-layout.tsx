import { authService } from '@/auth/lib/services/auth.service';
import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export function ProtectedAppLayout({ children }: Readonly<PropsWithChildren>) {
  const location = useLocation();

  if (!authService.isLoggedIn()) {
    return (
      <Navigate to="/auth/signin" replace state={{ from: location.pathname }} />
    );
  }

  return <>{children}</>;
}
