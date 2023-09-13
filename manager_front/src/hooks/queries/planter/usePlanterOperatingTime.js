import { useQuery } from "@tanstack/react-query";

import { getDashboardPlanterTimeAPI } from "@apis/planterAPIs";
import { PlanterOperatingTimeKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterOperatingTime({ queryType, successFn, errorFn }) {
  return useQuery([PlanterOperatingTimeKey, queryType], () => getDashboardPlanterTimeAPI(queryType), {
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
  });
}
