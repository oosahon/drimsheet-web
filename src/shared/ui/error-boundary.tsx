import { ErrorBoundary as SentryErrorBoundary } from "@sentry/react";
import { type ReactNode, type ReactElement, useState, useEffect } from "react";
import observabilityService from "@/shared/services/observability.service";
import { Button } from "@/shared/ui/button";
import FullPageLoader from "@/shared/ui/full-page-loader";
import { isAxiosError } from "axios";
import { handleApiError } from "@/shared/utils/api/errors";

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
        <pre className="text-left w-full max-w-2xl bg-muted p-4 rounded-md overflow-auto text-xs text-muted-foreground mt-4">
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
