import { QueryClient } from "@tanstack/react-query";

export type QueryKeyType = (typeof QUERY_KEYS)[keyof typeof QUERY_KEYS];

// TODO: use query keys map
export const QUERY_KEYS = {
  FILES: "files",
  FILES_COUNT: "filesCount",
  STORAGE_INFO: "storageInfo",
} as const;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default queryClient;
