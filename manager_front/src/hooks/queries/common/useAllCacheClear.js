import { useQueryClient } from "@tanstack/react-query";

export default function useAllCacheClear() {
  const queryClient = useQueryClient();
  function clearQueries() {
    queryClient.clear();
  }

  return clearQueries;
}
