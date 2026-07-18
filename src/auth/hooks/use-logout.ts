import authService from '@/auth/lib/auth.service';
import { useMutation } from '@tanstack/react-query';

export default function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}
