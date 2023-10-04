import { useQuery } from "@tanstack/react-query";

import { getDashboardRealTimeTodayAPI } from "@apis/planterAPIs";
import { PlanterRealTimeTodayKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterRealTimeToday({ planterId, successFn, errorFn }) {
  return useQuery([PlanterRealTimeTodayKey, planterId], () => getDashboardRealTimeTodayAPI(planterId), {
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
