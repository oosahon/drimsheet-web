import { userService } from '@/user/lib/services/user.service';
import { useQuery } from '@tanstack/react-query';

interface IUseProfileOptions {
  enabled?: boolean;
}

export function useProfile({ enabled = true }: IUseProfileOptions = {}) {
  return useQuery({
    queryKey: ['userService', 'getProfile'],
    queryFn: () => userService.getProfile(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
