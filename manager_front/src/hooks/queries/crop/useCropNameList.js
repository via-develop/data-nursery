import { useQuery } from "@tanstack/react-query";

import { getCropNameList } from "@apis/cropAPIs";

import { cropNameListKey } from "@src/utils/query-keys/CropQueryKeys";

export default function useCropNameList({ searchText, errorFn, successFn }) {
  return useQuery([cropNameListKey, searchText], () => getCropNameList(searchText), {
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
