import { authService } from '@/auth/lib/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
