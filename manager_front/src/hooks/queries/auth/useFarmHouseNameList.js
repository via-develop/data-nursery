import { useQuery } from "@tanstack/react-query";

import { getFarmHouseNameList } from "@apis/authAPIs";

import { farmHouseNameListKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useFarmHouseNameList({ searchText, errorFn, successFn }) {
  return useQuery([farmHouseNameListKey, searchText], () => getFarmHouseNameList(searchText), {
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
