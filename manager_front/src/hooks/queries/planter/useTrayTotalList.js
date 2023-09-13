import { useQuery } from "@tanstack/react-query";

import { getTrayTotalList } from "@apis/planterAPIs";

import { trayTotalListKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function useTrayTotalList({ searchText, errorFn, successFn }) {
  return useQuery([trayTotalListKey, searchText], () => getTrayTotalList(searchText), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
