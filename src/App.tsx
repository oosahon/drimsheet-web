import CompleteSignupRoute from '@/auth/routes/complete-signup.route';
import SignupRoute from '@/auth/routes/signup.route';
import DashboardRoute from '@/reporting/routes/dashboard.route';
import { DefaultErrorBoundary } from '@/shared/components/error-boundary';
import { AnimatedThemeToggler } from '@/shared/ui/animated-theme-toggler';
import { AppLayout } from '@/shared/ui/app-layout';
import { Toaster } from '@/shared/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom';

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
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Outlet />}>
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
          <ReactQueryDevtools initialIsOpen={false} />

          <AnimatedThemeToggler />
          <Toaster />
        </QueryClientProvider>
      </>
    </DefaultErrorBoundary>
  );
}

export default App;
