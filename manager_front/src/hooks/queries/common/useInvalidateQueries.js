import { useQueryClient } from "@tanstack/react-query";

export default function useInvalidateQueries() {
  const queryClient = useQueryClient();
  function invalidateQueries(keys, options) {
    queryClient.invalidateQueries({ queryKey: [...keys] });
  }

  return invalidateQueries;
}
