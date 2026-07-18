import userService from '@/user/lib/user.service';
import { useQuery } from '@tanstack/react-query';

export default function useProfile() {
  return useQuery({
    queryKey: ['userService.getProfile'],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
