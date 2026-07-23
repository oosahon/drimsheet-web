import type { ISignupFormValues } from '@/auth/components/signup-form/types';
import { authService } from '@/auth/lib/auth.service';
import { useMutation } from '@tanstack/react-query';

export function useSignupWithEmail() {
  return useMutation({
    mutationFn: async (payload: ISignupFormValues) => {
      await authService.signupWithEmail(payload);
    },
  });
}
