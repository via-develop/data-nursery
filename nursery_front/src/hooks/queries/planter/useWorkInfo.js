import { useQuery } from "@tanstack/react-query";

import { getWorkInfoAPI } from "@apis/planterAPIs";

import { workInfoKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useWorkInfo({ workId, errorFn, successFn }) {
  return useQuery([workInfoKey, workId], () => getWorkInfoAPI(workId), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: !!workId ? true : false,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
