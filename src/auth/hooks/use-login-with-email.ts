import authService from '@/auth/lib/auth.service';
import type { IEmailLoginReq } from '@/shared/utils/api/Api';
import { useMutation } from '@tanstack/react-query';

export default function useLoginWithEmail() {
  return useMutation({
    mutationFn: (payload: IEmailLoginReq) =>
      authService.loginWithEmail(payload),
  });
}
