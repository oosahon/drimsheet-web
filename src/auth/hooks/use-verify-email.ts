import { useMutation } from "@tanstack/react-query";
import authService from "../services/auth.service";

export default function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
