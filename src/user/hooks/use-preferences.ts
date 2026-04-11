import userService from '@/user/services/user.service';
import { useQuery } from '@tanstack/react-query';

export default function usePreferences() {
  return useQuery({
    queryKey: ['userService.getPreferences'],
    queryFn: () => userService.getPreferences(),
  });
}
