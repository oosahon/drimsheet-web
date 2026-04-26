import CompleteSignupRoute from '@/auth/routes/complete-signup.route';
import LoginRoute from '@/auth/routes/login.route';
import RequestPasswordResetRoute from '@/auth/routes/request-password-reset.route';
import ResetPasswordRoute from '@/auth/routes/reset-password.route';
import SignupRoute from '@/auth/routes/signup.route';
import AuthLayout from '@/auth/ui/containers/auth-layout';
import OAuthConfirmation from '@/auth/ui/containers/oauth-confirmation';
import type { TModuleRoutes } from '@/shared/types/routes.types';

const useAuthRoutes: TModuleRoutes = (basePath) => {
  return {
    path: basePath,
    element: <AuthLayout />,
    children: [
      { path: 'signin', element: <LoginRoute /> },
      { path: 'signup', element: <SignupRoute /> },
      { path: 'signup/complete', element: <CompleteSignupRoute /> },
      { path: 'forgot-password', element: <RequestPasswordResetRoute /> },
      { path: 'reset-password', element: <ResetPasswordRoute /> },
      { path: 'oauth-confirmation', element: <OAuthConfirmation /> },
    ],
  };
};

export default useAuthRoutes;
