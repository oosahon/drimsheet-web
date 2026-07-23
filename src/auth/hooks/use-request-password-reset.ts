import { authService } from '@/auth/lib/auth.service';
import { useMutation } from '@tanstack/react-query';

export function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
}
