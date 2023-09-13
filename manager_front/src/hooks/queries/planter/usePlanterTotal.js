import { useQuery } from "@tanstack/react-query";

import { getDashboardTotalAPI } from "@apis/planterAPIs";
import { PlanterTotalKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterTotal({ queryType, successFn, errorFn }) {
  return useQuery([PlanterTotalKey, queryType], () => getDashboardTotalAPI(queryType), {
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
