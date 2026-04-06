import purpleLedgerApi from "@/shared/utils/api";
import type { ISignupForm } from "../types/auth.types";

const authService = {
  getAuthToken() {
    return window.localStorage.getItem("token");
  },
  isLoggedIn() {
    return !!this.getAuthToken();
  },
  setToken(token: string, refreshToken?: string) {
    window.localStorage.setItem("token", token);
    if (refreshToken) {
      window.localStorage.setItem("refreshToken", refreshToken);
    }
  },
  removeToken() {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("refreshToken");
  },

  async signupWithEmail(payload: ISignupForm) {
    return purpleLedgerApi.auth.signupWithEmail({
      ...payload,
      reportingCurrencyCode: "NGN",
    });
  },
};

export default authService;
