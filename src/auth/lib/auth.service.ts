import type { ISignupFormValues } from '@/auth/components/signup-form/types';
import { purpleLedgerApi } from '@/shared/lib/api';
import type {
  IEmailLoginReq,
  IResetPasswordReq,
  IUser,
} from '@/shared/lib/api/Api';
import { jwtDecode } from 'jwt-decode';

let accessToken: string;
let refreshPromise: Promise<string> | null = null;

async function executeRefresh(): Promise<string> {
  try {
    const { data } = await purpleLedgerApi.auth.refreshAccessToken();
    authService.setToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    authService.removeToken();
    throw error;
  }
}

export const authService = {
  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  getToken() {
    return accessToken;
  },

  setToken(token: string) {
    localStorage.setItem('isLoggedIn', 'true');
    accessToken = token;
  },

  removeToken() {
    localStorage.removeItem('isLoggedIn');
    accessToken = '';
  },

  async getAccessToken(): Promise<string> {
    if (refreshPromise) {
      return refreshPromise;
    }

    refreshPromise = (async () => {
      try {
        if (typeof navigator !== 'undefined' && navigator.locks) {
          return await navigator.locks.request(
            'token_refresh_lock',
            executeRefresh
          );
        } else {
          return await executeRefresh();
        }
      } finally {
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  },

  async init() {
    if (this.isLoggedIn() && !accessToken) {
      try {
        await this.getAccessToken();
      } catch (error) {
        console.error('Failed to get access token during init:', error);
      }
    }
  },

  async signupWithEmail(payload: ISignupFormValues) {
    return purpleLedgerApi.auth.signupWithEmail(payload);
  },

  async verifyEmail(token: string) {
    const response = await purpleLedgerApi.auth.verifyEmail({ token });
    this.setToken(response.data.accessToken);
  },

  async loginWithEmail(payload: IEmailLoginReq) {
    const response = await purpleLedgerApi.auth.loginWithEmail(payload);
    this.setToken(response.data.accessToken);
  },

  async requestPasswordReset(email: string) {
    await purpleLedgerApi.auth.getPasswordResetLink({ email });
  },

  async resetPassword(payload: IResetPasswordReq) {
    const response = await purpleLedgerApi.auth.resetPassword(payload);
    this.setToken(response.data.accessToken);
  },

  decodeToken(token?: string | null) {
    if (!token) return null;
    return jwtDecode(token) as IUser;
  },

  async logout() {
    await purpleLedgerApi.auth.logout();
    this.removeToken();
  },
};
