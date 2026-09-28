import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "../api/favorites";

export const useFavorites = (userId) =>
  useQuery({
    queryKey: ["favorites", userId],
    queryFn: favoritesApi.list,
    enabled: !!userId,
  });
export function useToggleFavorite() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.toggle,
    onSuccess: () => client.invalidateQueries({ queryKey: ["favorites"] }),
  });
}
