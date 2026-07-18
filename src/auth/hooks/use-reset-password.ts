import authService from '@/auth/lib/auth.service';
import type { IResetPasswordReq } from '@/shared/utils/api/Api';
import { useMutation } from '@tanstack/react-query';

export default function useResetPassword() {
  return useMutation({
    mutationFn: (payload: IResetPasswordReq) =>
      authService.resetPassword(payload),
  });
}
