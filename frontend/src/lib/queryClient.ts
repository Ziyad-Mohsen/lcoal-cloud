import { QueryClient } from "@tanstack/react-query";

// TODO: use query keys map

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default queryClient;
