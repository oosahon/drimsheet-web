import AuthLayout from '@/auth/ui/layouts/auth-layout';
import CompleteSignupPage from '@/auth/ui/pages/complete-signup.page';
import LoginPage from '@/auth/ui/pages/login.page';
import OAuthConfirmationPage from '@/auth/ui/pages/oauth-confirmation.page';
import RequestPasswordResetPage from '@/auth/ui/pages/request-password-reset.page';
import ResetPasswordPage from '@/auth/ui/pages/reset-password.page';
import SignupPage from '@/auth/ui/pages/signup.page';
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
