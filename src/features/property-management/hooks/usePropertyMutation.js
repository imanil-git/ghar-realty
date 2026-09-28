import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyApi } from "../../properties/api/properties";

export function usePropertyMutation(action) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: propertyApi[action],
    onSuccess: async () => {
      await Promise.all([
        client.invalidateQueries({ queryKey: ["properties"] }),
        client.invalidateQueries({ queryKey: ["favorites"] }),
      ]);
    },
  });
}
