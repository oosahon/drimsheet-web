import type { IHttpErrorDto } from '@/shared/utils/api/Api';
import { type AxiosError } from 'axios';

export type TApiError = IHttpErrorDto & {
  code: number;
};

export const parseApiError = (err: unknown): TApiError => {
  const error = err as AxiosError<IHttpErrorDto>;

  const { response } = error;

  return {
    code: response?.status ?? 500,
    name: response?.data?.name ?? 'UnknownError',
    errorKey: response?.data?.errorKey ?? '',
    validationErrors: response?.data?.validationErrors ?? [],
    cause: response?.data?.cause,
  };
};
