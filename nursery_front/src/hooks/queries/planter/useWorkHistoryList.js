import { useQuery } from "@tanstack/react-query";

import { getWorkHistoryListAPI } from "@apis/planterAPIs";

import { workHistoryKey } from "@utils/query-keys/PlanterQueryKeys";

export default function useWorkHistoryList({ serialNumber, year, month, date, page, errorFn, successFn }) {
  return useQuery(
    [workHistoryKey, year, month, date, page],
    () => getWorkHistoryListAPI(serialNumber, year, month, date, page),
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
      enabled: !!serialNumber ? true : false,
      refetchOnWindowFocus: true,
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchInterval: false,
      onError: (error) => errorFn(error),
      onSuccess: (data) => successFn(data),
    },
  );
}
