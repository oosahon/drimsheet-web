import { authService } from '@/auth/lib/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}
