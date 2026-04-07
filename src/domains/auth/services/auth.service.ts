import purpleLedgerApi from "@/shared/utils/api";
import type { ISignupFormValues } from "../ui/signup-form";

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

  async signupWithEmail(payload: ISignupFormValues) {
    return purpleLedgerApi.auth.signupWithEmail(payload);
  },
};

export default authService;
