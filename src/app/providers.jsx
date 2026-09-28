import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export default function Providers({ children }) {
  useEffect(() => {
    function expireSession() {
      queryClient.setQueryData(["session"], null);
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "session",
      });
    }
    window.addEventListener("ghar:session-expired", expireSession);
    return () =>
      window.removeEventListener("ghar:session-expired", expireSession);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
