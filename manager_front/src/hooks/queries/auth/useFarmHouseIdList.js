import { useQuery } from "@tanstack/react-query";

import { getFarmHouseIdList } from "@apis/authAPIs";

import { farmHouseIdListKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useFarmHouseIdList({ searchText, errorFn, successFn }) {
  return useQuery([farmHouseIdListKey, searchText], () => getFarmHouseIdList(searchText), {
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
