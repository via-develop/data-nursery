import { useQuery } from "@tanstack/react-query";

import { getDashboardRealTimeAPI } from "@apis/planterAPIs";
import { PlanterRealTimeKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterRealTime({ page, size, successFn, errorFn }) {
  return useQuery([PlanterRealTimeKey, page, size], () => getDashboardRealTimeAPI(page, size), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    onSuccess: (data) => successFn(data),
    onError: (error) => errorFn(error),
  });
}
