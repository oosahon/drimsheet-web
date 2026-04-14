import type { ISignupFormValues } from '@/auth/ui/signup-form';
import purpleLedgerApi from '@/shared/utils/api';
import type {
  ILoginReq,
  IResetPasswordReq,
  IUser,
} from '@/shared/utils/api/Api';
import { jwtDecode } from 'jwt-decode';

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

  async loginWithEmail(payload: ILoginReq) {
    const response = await purpleLedgerApi.auth.loginWithEmail(payload);
    this.setToken(response.data.authToken, response.data.refreshToken);
  },

  async requestPasswordReset(email: string) {
    await purpleLedgerApi.auth.getPasswordResetLink({ email });
  },

  async resetPassword(payload: IResetPasswordReq) {
    const res = await purpleLedgerApi.auth.resetPassword(payload);
    this.setToken(res.data.authToken, res.data.refreshToken);
  },

  decodeToken(token?: string | null) {
    if (!token) return null;
    return jwtDecode(token) as IUser;
  },
};

export default authService;
