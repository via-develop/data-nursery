import { useQuery } from "@tanstack/react-query";

import { getAllFarmListAPI } from "@apis/authAPIs";
import { farmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useFarmAllList({ nameOrder, statusOrder, page, size, successFn, errorFn }) {
  return useQuery(
    [farmAllListKey, nameOrder, statusOrder, page, size],
    () => getAllFarmListAPI(nameOrder, statusOrder, page, size),
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchInterval: false,
      onError: (error) => errorFn(error),
      onSuccess: (data) => successFn(data),
    },
  );
}
