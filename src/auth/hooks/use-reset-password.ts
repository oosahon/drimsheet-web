import { authService } from '@/auth/lib/auth.service';
import type { IResetPasswordReq } from '@/shared/lib/api/Api';
import { useMutation } from '@tanstack/react-query';

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: IResetPasswordReq) =>
      authService.resetPassword(payload),
  });
}
