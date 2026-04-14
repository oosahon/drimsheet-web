import authService from '@/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export default function useRequestPasswordReset() {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
  });
}
