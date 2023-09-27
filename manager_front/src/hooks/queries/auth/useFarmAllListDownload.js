import { useQuery } from "@tanstack/react-query";

import { getFarmhouseListDownloadAPI } from "@apis/authAPIs";
import { farmHouseDownloadKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useFarmAllListDownload({ successFn, errorFn }) {
  return useQuery([farmHouseDownloadKey], () => getFarmhouseListDownloadAPI(), {
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
  });
}
