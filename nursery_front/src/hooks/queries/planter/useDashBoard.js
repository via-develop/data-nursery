import { useQuery } from "@tanstack/react-query";

import { getDashBoardAPI } from "@apis/planterAPIs";

import { dashBoardKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useDashBoard({ errorFn, successFn }) {
  return useQuery([dashBoardKey], () => getDashBoardAPI(), {
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
