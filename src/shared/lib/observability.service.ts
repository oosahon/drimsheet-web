import * as Sentry from '@sentry/react';

export const observabilityService = {
  report(error: Error, info: Record<string, unknown>) {
    Sentry.captureException(error, {
      extra: info,
    });
  },
};
