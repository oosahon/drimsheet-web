import { userService } from '@/user/lib/services/user.service';
import { useQuery } from '@tanstack/react-query';

export const userPreferencesQueryKey = [
  'userService',
  'getPreferences',
] as const;

export function usePreferences() {
  return useQuery({
    queryKey: userPreferencesQueryKey,
    queryFn: () => userService.getPreferences(),
  });
}
