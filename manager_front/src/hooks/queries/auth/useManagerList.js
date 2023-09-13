import { useQuery } from "@tanstack/react-query";

import { getAdminListAPI } from "@apis/authAPIs";
import { settingManagerListKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useManagerList({ page, size, successFn, errorFn }) {
  return useQuery([settingManagerListKey, page, size], () => getAdminListAPI(page, size), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: false,
    refetchInterval: false,
    onSuccess: (data) => successFn(data),
    onError: (error) => errorFn(error),
  });
}
