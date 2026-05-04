import AppRoutes from '@/_app/index.routes';
import AccessTokenManager from '@/auth/ui/containers/access-token-manager';
import { Toaster } from '@/shared/ui/components/sonner';
import { TooltipProvider } from '@/shared/ui/components/tooltip';
import { DefaultErrorBoundary } from '@/shared/ui/containers/error-boundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

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
      <AccessTokenManager>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          <Toaster />
        </QueryClientProvider>
      </AccessTokenManager>
    </DefaultErrorBoundary>
  );
}

export default App;
