import { AuthLayout } from '@/auth/layouts/auth-layout';
import { CompleteSignupPage } from '@/auth/pages/complete-signup';
import { LoginPage } from '@/auth/pages/login';
import { OAuthConfirmationPage } from '@/auth/pages/oauth-confirmation';
import { RequestPasswordResetPage } from '@/auth/pages/request-password-reset';
import { ResetPasswordPage } from '@/auth/pages/reset-password';
import { SignupPage } from '@/auth/pages/signup';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';

export const useAuthRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AuthLayout />,
    children: [
      { path: 'signin', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'signup/complete', element: <CompleteSignupPage /> },
      { path: 'forgot-password', element: <RequestPasswordResetPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'oauth-confirmation', element: <OAuthConfirmationPage /> },
    ],
  };
};
