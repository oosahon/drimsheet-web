import AuthLayout from '@/auth/layouts/auth-layout';
import CompleteSignupPage from '@/auth/pages/complete-signup.page';
import LoginPage from '@/auth/pages/login.page';
import OAuthConfirmationPage from '@/auth/pages/oauth-confirmation.page';
import RequestPasswordResetPage from '@/auth/pages/request-password-reset.page';
import ResetPasswordPage from '@/auth/pages/reset-password.page';
import SignupPage from '@/auth/pages/signup.page';
import type { TModuleRoutes } from '@/shared/types/routes.types';

const useAuthRoutes: TModuleRoutes = (basePath) => {
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

export default useAuthRoutes;
