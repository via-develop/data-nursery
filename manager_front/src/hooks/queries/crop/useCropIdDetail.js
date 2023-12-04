import { useQuery } from "@tanstack/react-query";

import { getCropIdDetailAPI } from "@apis/cropAPIs";
import { cropIdDetailKey } from "@src/utils/query-keys/CropQueryKeys";

export default function useCropIdDetail({ cropId, dateRange, successFn, errorFn }) {
  return useQuery([cropIdDetailKey, cropId, dateRange], () => getCropIdDetailAPI(cropId, dateRange), {
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
