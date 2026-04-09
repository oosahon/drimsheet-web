import { useQuery } from "@tanstack/react-query";
import userService from "../services/user.service";

export default function usePreferences() {
  return useQuery({
    queryKey: ["usePreferences"],
    queryFn: () => userService.getPreferences(),
  });
}
