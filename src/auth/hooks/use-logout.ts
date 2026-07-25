import { authService } from '@/auth/lib/services/auth.service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
