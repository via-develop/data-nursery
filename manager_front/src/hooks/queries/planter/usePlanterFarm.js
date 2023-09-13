import { useQuery } from "@tanstack/react-query";

import { getDashboardFarmHouseAPI } from "@apis/planterAPIs";
import { PlanterFarmKey } from "@src/utils/query-keys/PlanterQueryKeys";

export default function usePlanterFarm({ queryType, successFn, errorFn }) {
  return useQuery([PlanterFarmKey, queryType], () => getDashboardFarmHouseAPI(queryType), {
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
