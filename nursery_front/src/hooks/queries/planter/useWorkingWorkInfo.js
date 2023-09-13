import { useQuery } from "@tanstack/react-query";

import { getWorkingWorkInfoAPI } from "@apis/planterAPIs";

import { workingWorkInfoKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useWorkingWorkInfo({ serialNumber, errorFn, successFn }) {
  return useQuery([workingWorkInfoKey], () => getWorkingWorkInfoAPI(serialNumber), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: !!serialNumber ? true : false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
