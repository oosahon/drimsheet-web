import authService from '@/auth/services/auth.service';
import type { ILoginReq } from '@/shared/utils/api/Api';
import { useMutation } from '@tanstack/react-query';

export default function useLoginWithEmail() {
  return useMutation({
    mutationFn: (payload: ILoginReq) => authService.loginWithEmail(payload),
  });
}
