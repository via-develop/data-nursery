import { useQuery } from "@tanstack/react-query";

import { getTrayListAPI } from "@apis/planterAPIs";

import { trayListKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function useTrayList({ errorFn, successFn }) {
  return useQuery([trayListKey], () => getTrayListAPI(), {
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
