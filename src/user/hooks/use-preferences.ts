import { userService } from '@/user/lib/user.service';
import { useQuery } from '@tanstack/react-query';

export function usePreferences() {
  return useQuery({
    queryKey: ['userService.getPreferences'],
    queryFn: () => userService.getPreferences(),
  });
}
