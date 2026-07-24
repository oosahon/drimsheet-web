import { authService } from '@/auth/lib/services/auth.service';
import type { IEmailLoginReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useLoginWithEmail() {
  return useMutation({
    mutationFn: (payload: IEmailLoginReq) =>
      authService.loginWithEmail(payload),
  });
}
