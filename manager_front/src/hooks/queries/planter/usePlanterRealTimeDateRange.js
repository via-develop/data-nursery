import { useQuery } from "@tanstack/react-query";

import { getDashboardRealTimeDateRangeAPI } from "@apis/planterAPIs";
import { PlanterRealTimeDateRangeKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterRealTimeDateRange({ planterId, dateRange, successFn, errorFn }) {
  return useQuery(
    [PlanterRealTimeDateRangeKey, planterId, dateRange],
    () => getDashboardRealTimeDateRangeAPI(planterId, dateRange),
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
      enabled: !!planterId && !!dateRange,
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchInterval: false,
      onSuccess: (data) => successFn(data),
      onError: (error) => errorFn(error),
    },
  );
}
