import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/getCurrentUser";

export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: getCurrentUser,
    retry: false,
    refetchInterval: 60_000,
  });
}
