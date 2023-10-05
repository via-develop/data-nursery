import { useQuery } from "@tanstack/react-query";

import { getStaticsListDownloadAPI } from "@apis/authAPIs";
import { staticsListDownloadKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useStaticsListDownload({
  year,
  month,
  dateRange,
  farmHouseId,
  farmhouseName,
  cropName,
  trayTotal,
  successFn,
  errorFn,
}) {
  return useQuery(
    [staticsListDownloadKey, year, month, dateRange, farmHouseId, farmhouseName, cropName, trayTotal],
    () => getStaticsListDownloadAPI(year, month, dateRange, farmHouseId, farmhouseName, cropName, trayTotal),
    {
      staleTime: 10 * (60 * 1000), // 10 mins
      cacheTime: 15 * (60 * 1000), // 15 mins
      retry: 0,
      enabled: true,
      refetchOnWindowFocus: false,
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchInterval: false,
      onError: (error) => errorFn(error),
      onSuccess: (data) => successFn(data),
    },
  );
}
