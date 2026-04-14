import authService from '@/auth/services/auth.service';
import { Api } from '@/shared/utils/api/Api';
import type { InternalAxiosRequestConfig } from 'axios';

const purpleLedgerApi = new Api({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
});

purpleLedgerApi.instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = authService.getAuthToken();

    if (config.url?.includes('signup/complete')) {
      return config;
    }

    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error: Error) => {
    return Promise.reject(error);
  }
);

export default purpleLedgerApi;
