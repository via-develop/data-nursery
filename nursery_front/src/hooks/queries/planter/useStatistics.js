import { useQuery } from "@tanstack/react-query";

import { getStatisticsAPI } from "@apis/planterAPIs";

import { statisticsKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useStatistics({ year, month, errorFn, successFn }) {
  return useQuery([statisticsKey, year, month], () => getStatisticsAPI(year, month), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
