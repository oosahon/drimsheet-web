import { useQuery } from "@tanstack/react-query";
import userService from "../services/user.service";

export default function useProfile() {
  return useQuery({
    queryKey: ["useProfile"],
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000,
  });
}
