import { useQuery } from "@tanstack/react-query";

import { getDashboardCropTotal } from "@apis/planterAPIs";
import { PlanterCropKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterCropTotal({ queryType, successFn, errorFn }) {
  return useQuery([PlanterCropKey, queryType], () => getDashboardCropTotal(queryType), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: !!queryType ? true : false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchInterval: false,
    onSuccess: (data) => successFn(data),
    onError: (error) => errorFn(error),
  });
}
