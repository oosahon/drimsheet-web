import { DefaultErrorBoundary } from '@/_app/containers/error-boundary/error-boundary';
import {
  LaunchDarklyContextSynchronizerContainer,
  LaunchDarklyProvider,
} from '@/_app/containers/launchdarkly';
import { AppRoutes } from '@/_app/index.routes';
import { AccessTokenManagerContainer } from '@/auth/components/access-token-manager';
import { authService } from '@/auth/lib/services/auth.service';
import { Toaster } from '@/shared/components/sonner';
import { TooltipProvider } from '@/shared/components/tooltip';
import { configureApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { configurePurpleLedgerApi } from '@/shared/lib/api';
import { localStorageService } from '@/shared/lib/services/local-storage.service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';

configurePurpleLedgerApi({
  getToken: () => authService.getToken(),
  getAccessToken: () => authService.getAccessToken(),
  getAccountingEntityId: () => localStorageService.getAccountingEntityId(),
});

configureApiErrorHandler({
  handleUnauthorized: () => {
    authService.removeToken();
    window.location.href = '/auth/signin';
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export function App() {
  return (
    <DefaultErrorBoundary>
      <AccessTokenManagerContainer>
        <QueryClientProvider client={queryClient}>
          <LaunchDarklyProvider>
            <TooltipProvider>
              <BrowserRouter>
                <LaunchDarklyContextSynchronizerContainer />
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
            <ReactQueryDevtools initialIsOpen={false} />
            <Toaster />
          </LaunchDarklyProvider>
        </QueryClientProvider>
      </AccessTokenManagerContainer>
    </DefaultErrorBoundary>
  );
}
