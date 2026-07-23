import { authService } from '@/auth/lib/auth.service';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
