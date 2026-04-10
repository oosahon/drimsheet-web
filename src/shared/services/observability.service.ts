import * as Sentry from "@sentry/react";

const observabilityService = {
  report(error: Error, info: Record<string, unknown>) {
    Sentry.captureException(error, {
      extra: info,
    });
  },
};

export default observabilityService;