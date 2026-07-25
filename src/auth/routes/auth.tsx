import { AuthLayout } from '@/auth/layouts/auth-layout';
import { CompleteSignUpPage } from '@/auth/pages/complete-signup';
import { OAuthConfirmationPage } from '@/auth/pages/oauth-confirmation';
import { RequestPasswordResetPage } from '@/auth/pages/request-password-reset';
import { ResetPasswordPage } from '@/auth/pages/reset-password';
import { SignInPage } from '@/auth/pages/sign-in';
import { SignUpPage } from '@/auth/pages/sign-up';
import type { TModuleRoutes } from '@/shared/lib/types/routes.types';

export const useAuthRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AuthLayout />,
    children: [
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
      { path: 'signup/complete', element: <CompleteSignUpPage /> },
      { path: 'forgot-password', element: <RequestPasswordResetPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'oauth-confirmation', element: <OAuthConfirmationPage /> },
    ],
  };
};
