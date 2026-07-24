import { Button } from '@/shared/components/button';
import { FullPageLoader } from '@/shared/components/full-page-loader';
import { useApiErrorHandler } from '@/shared/hooks/use-api-error-handler';
import { observabilityService } from '@/shared/lib/services/observability.service';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';
import { isAxiosError } from 'axios';
import { type ReactElement, type ReactNode, useEffect, useState } from 'react';

export interface DefaultErrorBoundaryProps {
  children: ReactNode;
  fallback?:
    | ReactElement
    | ((errorData: {
        error: unknown;
        componentStack: string;
        eventId: string;
        resetError: () => void;
      }) => ReactElement);
}

const DefaultErrorFallback = ({
  error,
  resetError,
}: {
  error: unknown;
  resetError: () => void;
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // This is to prevent the error boundary from immediately showing the error fallback
    // for a split second before the full page loader is shown.
    const timer = setTimeout(() => setShow(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const errorMessage = error instanceof Error ? error.message : String(error);

  if (!show) {
    return <FullPageLoader />;
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[400px] text-center space-y-4">
      <h2 className="text-2xl font-semibold text-foreground">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground w-full max-w-md">
        An unexpected error occurred. Our technical team has been notified.
      </p>
      {import.meta.env.DEV && (
        <pre className="text-center w-full max-w-2xl bg-muted p-4 rounded-md overflow-auto text-xs text-muted-foreground mt-4">
          {errorMessage}
        </pre>
      )}
      <Button onClick={resetError} className="mt-4">
        Try Again
      </Button>
    </div>
  );
};

export const DefaultErrorBoundary = ({
  children,
  fallback,
}: DefaultErrorBoundaryProps) => {
  const handleApiError = useApiErrorHandler();

  return (
    <SentryErrorBoundary
      fallback={fallback || DefaultErrorFallback}
      onError={(error: unknown, componentStack: string) => {
        if (isAxiosError(error)) {
          handleApiError(error);
        } else {
          const appError =
            error instanceof Error ? error : new Error(String(error));
          observabilityService.report(appError, { componentStack });
        }
      }}
    >
      {children}
    </SentryErrorBoundary>
  );
};
