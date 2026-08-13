import { Api } from '@/shared/lib/api/Api';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

interface PurpleLedgerApiAuthConfig {
  getToken?: () => string | undefined;
  getAccessToken?: () => Promise<string>;
  getAccountingEntityId?: () => string | undefined;
}

export const purpleLedgerApi = new Api({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  withCredentials: true,
});

let authConfig: PurpleLedgerApiAuthConfig = {};

export function configurePurpleLedgerApi(config: PurpleLedgerApiAuthConfig) {
  authConfig = config;
}

purpleLedgerApi.instance.defaults.withCredentials = true;

purpleLedgerApi.instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = authConfig.getToken?.();
    const accountingEntityId = authConfig.getAccountingEntityId?.();

    config.headers.withCredentials = true;

    if (config.url?.includes('signup/complete')) {
      return config;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (accountingEntityId) {
      config.headers['x-accounting-entity-id'] = accountingEntityId;
    }

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

purpleLedgerApi.instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const shouldRetry =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth');

    if (shouldRetry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await authConfig.getAccessToken?.();
        if (!newAccessToken) {
          return Promise.reject(error);
        }
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return purpleLedgerApi.instance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
