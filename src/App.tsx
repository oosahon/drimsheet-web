import CompleteSignupRoute from '@/auth/routes/complete-signup.route';
import LoginRoute from '@/auth/routes/login.route';
import SignupRoute from '@/auth/routes/signup.route';
import DashboardRoute from '@/reporting/routes/dashboard.route';
import AppLayout from '@/shared/components/app-layout';
import { DefaultErrorBoundary } from '@/shared/components/error-boundary';
import { Toaster } from '@/shared/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AuthLayout from './auth/components/auth-layout';
import { TooltipProvider } from './shared/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <DefaultErrorBoundary>
      <>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<LoginRoute />} />
                  <Route path="signup" element={<SignupRoute />} />
                  <Route
                    path="signup/complete"
                    element={<CompleteSignupRoute />}
                  />
                </Route>

                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardRoute />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>

          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </>
    </DefaultErrorBoundary>
  );
}

export default App;
