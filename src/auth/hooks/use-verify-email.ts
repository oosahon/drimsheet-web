import authService from '@/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export default function useVerifyEmail() {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
  });
}
