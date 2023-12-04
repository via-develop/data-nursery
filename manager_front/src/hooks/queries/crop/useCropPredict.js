import { useQuery } from "@tanstack/react-query";

import { getCropPredictAPI } from "@apis/cropAPIs";
import { cropPredictKey } from "@src/utils/query-keys/CropQueryKeys";

export default function useCropPredict({ dateRange, successFn, errorFn }) {
  return useQuery([cropPredictKey, dateRange], () => getCropPredictAPI(dateRange), {
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
