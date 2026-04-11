import type { ISignupFormValues } from '@/auth/ui/signup-form';
import purpleLedgerApi from '@/shared/utils/api';

const authService = {
  getAuthToken() {
    return window.localStorage.getItem('token');
  },
  isLoggedIn() {
    return !!this.getAuthToken();
  },
  setToken(token: string, refreshToken?: string) {
    window.localStorage.setItem('token', token);
    if (refreshToken) {
      window.localStorage.setItem('refreshToken', refreshToken);
    }
  },
  removeToken() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('refreshToken');
  },

  async signupWithEmail(payload: ISignupFormValues) {
    return purpleLedgerApi.auth.signupWithEmail(payload);
  },

  async verifyEmail(token: string) {
    const response = await purpleLedgerApi.auth.verifyEmail({ token });
    this.setToken(response.data.authToken, response.data.refreshToken);
  },
};

export default authService;
