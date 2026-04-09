import observabilityService from "@/shared/services/observability.service";
import { toast } from "sonner";

import type { IApiValidationError } from "./Api";
import { type AxiosError } from "axios";
import authService from "@/auth/services/auth.service";

type TApiError = {
  code?: number;
  message?: string;
  validationErrors: IApiValidationError[];
};

export const parseApiError = (err: unknown) => {
  const error = err as AxiosError<TApiError>;

  const { response } = error;

  const errorObj: TApiError = {
    code: response?.status ?? 500,
    message: response?.data?.message,
    validationErrors: response?.data?.validationErrors ?? [],
  };

  return errorObj;
};

type THandleErrorOptions = {
  showToast?: boolean;
  setValidationError?: (validationError: IApiValidationError[]) => void;
  report?: boolean;
};

export const handleApiError = (err: unknown, options?: THandleErrorOptions) => {
  const error = parseApiError(err);

  if (error.code === 401) {
    authService.removeToken();
    window.location.href = "/auth/login";
    return;
  }

  if (error.code === 500) {
    observabilityService.report(new Error("Server error"), error);
  }

  if (options?.showToast) {
    toast.error(error.message ?? "An error occurred");
  }

  options?.setValidationError?.(error.validationErrors);

  return error;
};
