import { useMutation } from "@tanstack/react-query";
import authService from "../services/auth.service";
import type { ISignupForm } from "../types/auth.types";

export default function useSignupWithEmail() {
  return useMutation({
    mutationFn: async (payload: ISignupForm) => {
      await authService.signupWithEmail(payload);
    },
  });
}
