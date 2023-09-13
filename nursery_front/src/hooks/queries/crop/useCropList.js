import { useQuery } from "@tanstack/react-query";

import { getCropListAPI } from "@apis/cropAPIs";

import { cropListKey } from "@utils/query-keys/CropQueryKeys";

export default function useCropList({ errorFn, successFn }) {
  return useQuery([cropListKey], () => getCropListAPI(), {
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
