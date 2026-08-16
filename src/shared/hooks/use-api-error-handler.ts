import apiErrorsJson from '@/shared/i18n/locales/en/api-errors.json';
import { parseApiError } from '@/shared/lib/api';
import type { IApiValidationError } from '@/shared/lib/api/Api';
import { observabilityService } from '@/shared/lib/services/observability.service';
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

interface IApiErrorHandlerConfig {
  handleUnauthorized?: () => void;
}

let apiErrorHandlerConfig: IApiErrorHandlerConfig = {};

export function configureApiErrorHandler(config: IApiErrorHandlerConfig) {
  apiErrorHandlerConfig = config;
}

function toError(value: unknown) {
  return value instanceof Error ? value : new Error('API client failure');
}

export function useApiErrorHandler() {
  const handleApiError = useCallback(
    (errorValue: unknown, options?: THandleErrorOptions) => {
      const error = parseApiError(errorValue);

      observabilityService.addApiFailureBreadcrumb({
        kind: error.kind,
        ...(error.method ? { method: error.method } : {}),
        ...(error.statusCode ? { statusCode: error.statusCode } : {}),
        ...(error.errorKey ? { errorKey: error.errorKey } : {}),
        ...(error.correlationId ? { correlationId: error.correlationId } : {}),
      });

      if (
        error.kind === 'server-response' &&
        error.code === 401 &&
        !window.location.pathname.startsWith('/auth/')
      ) {
        apiErrorHandlerConfig.handleUnauthorized?.();
        return;
      }

      const isBrowserOwnedFailure = error.kind !== 'server-response';
      if (isBrowserOwnedFailure && options?.report !== false) {
        observabilityService.report(toError(errorValue), {
          source: 'api-client',
          operation: 'request',
          ...(error.errorKey ? { errorKey: error.errorKey } : {}),
          ...(error.correlationId
            ? { correlationId: error.correlationId }
            : {}),
        });
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
    },
    []
  );

  return handleApiError;
}
