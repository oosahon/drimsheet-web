import { DefaultErrorBoundary } from '@/shared/components/error-boundary';
import { Toaster } from '@/shared/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app.routes';
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
              <AppRoutes />
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
