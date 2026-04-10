import { useQuery } from "@tanstack/react-query";
import userService from "../services/user.service";

export default function usePreferences() {
  return useQuery({
    queryKey: ["userService.getPreferences"],
    queryFn: () => userService.getPreferences(),
  });
}
