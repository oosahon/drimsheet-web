import authService from '@/auth/services/auth.service';
import i18n from '@/shared/i18n/config';
import apiErrorsJson from '@/shared/i18n/locales/en/api-errors.json';
import observabilityService from '@/shared/services/observability.service';
import type { IApiValidationError } from '@/shared/utils/api/Api';
import { parseApiError } from '@/shared/utils/api/errors';
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

export default function useApiErrorHandler() {
  const handleApiError = useCallback(
    (err: unknown, options?: THandleErrorOptions) => {
      try {
        const error = parseApiError(err);

        if (
          error.code === 401 &&
          !window.location.pathname.startsWith('/auth/')
        ) {
          authService.removeToken();
          window.location.href = '/auth/signin';
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
