import authService from '@/auth/services/auth.service';
import { useMutation } from '@tanstack/react-query';

export default function useLogout() {
  return useMutation({
    mutationFn: () => authService.logout(),
  });
}
