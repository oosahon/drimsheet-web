import authService from '@/auth/services/auth.service';
import type { ISignupFormValues } from '@/auth/ui/components/signup-form';
import { useMutation } from '@tanstack/react-query';

export default function useSignupWithEmail() {
  return useMutation({
    mutationFn: async (payload: ISignupFormValues) => {
      await authService.signupWithEmail(payload);
    },
  });
}
