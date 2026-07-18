import apiErrorsJson from '@/shared/i18n/locales/en/api-errors.json';
import type { IApiValidationError } from '@/shared/lib/api/Api';
import { parseApiError } from '@/shared/lib/api/errors';
import observabilityService from '@/shared/lib/observability.service';
import i18n from 'i18next';
import { useCallback } from 'react';
import { toast } from 'sonner';

export type TApiErrorKey = keyof typeof apiErrorsJson;

const isApiErrorKey = (key: string): key is TApiErrorKey => {
  return key in apiErrorsJson;
};

type THandleErrorOptions = {
  showToast?: boolean;
  setValidationError?: (validationError: IApiValidationError[]) => void;
  report?: boolean;
};

interface ApiErrorHandlerConfig {
  handleUnauthorized?: () => void;
}

let apiErrorHandlerConfig: ApiErrorHandlerConfig = {};

export function configureApiErrorHandler(config: ApiErrorHandlerConfig) {
  apiErrorHandlerConfig = config;
}

export default function useApiErrorHandler() {
  const handleApiError = useCallback(
    (err: unknown, options?: THandleErrorOptions) => {
      try {
        const error = parseApiError(err);

        if (
          error.code === 401 &&
          !window.location.pathname.startsWith('/auth/')
        ) {
          apiErrorHandlerConfig.handleUnauthorized?.();
          return;
        }

        if (error.code === 500) {
          observabilityService.report(
            new Error('Server error'),
            error as unknown as Record<string, unknown>
          );
        }

        if (options?.showToast) {
          const errorKey = error.errorKey;
          if (errorKey && isApiErrorKey(errorKey)) {
            toast.error(i18n.t(errorKey, { ns: 'api-errors' }));
          } else {
            toast.error(i18n.t('an_error_occurred', { ns: 'shared' }));
          }
        }

        options?.setValidationError?.(error.validationErrors ?? []);

        return error;
      } catch (e) {
        observabilityService.report(e as Error, {});
      }
    },
    []
  );

  return handleApiError;
}
