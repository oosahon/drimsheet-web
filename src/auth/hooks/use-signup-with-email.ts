import { useMutation } from "@tanstack/react-query";
import authService from "../services/auth.service";
import type { ISignupFormValues } from "../ui/signup-form/presentation";

export default function useSignupWithEmail() {
  return useMutation({
    mutationFn: async (payload: ISignupFormValues) => {
      await authService.signupWithEmail(payload);
    },
  });
}
