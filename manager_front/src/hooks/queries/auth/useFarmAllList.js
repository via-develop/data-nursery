import { useQuery } from "@tanstack/react-query";

import { getAllFarmListAPI } from "@apis/authAPIs";
import { useFarmAllListKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function useFarmAllList({ nameOrder, statusOrder, page, size, successFn, errorFn }) {
  return useQuery(
    [useFarmAllListKey, nameOrder, statusOrder, page, size],
    () => getAllFarmListAPI(nameOrder, statusOrder, page, size),
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      refetchInterval: false,
      onSuccess: (data) => successFn(data),
      onError: (error) => errorFn(error),
    },
  );
}
