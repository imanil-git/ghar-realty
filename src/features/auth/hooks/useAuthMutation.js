import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";

export function useAuthMutation(action) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: authApi[action],
    onSuccess: async (user) => {
      if (["login", "signup", "logout", "resetPassword"].includes(action)) {
        await client.cancelQueries();
        client.removeQueries({
          predicate: (query) => query.queryKey[0] !== "session",
        });
        client.setQueryData(
          ["session"],
          ["login", "signup"].includes(action) ? user : null,
        );
      }
      if (action === "updateProfile") {
        client.setQueryData(["session"], user);
        await client.invalidateQueries({ queryKey: ["properties"] });
      }
    },
  });
}
