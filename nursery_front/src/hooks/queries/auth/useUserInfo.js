import { useQuery } from "@tanstack/react-query";

import { getUserInfo } from "@apis/authAPIs";

import { userInfoKey } from "@utils/query-keys/AuthQueryKeys";

export default function useUserInfo({ errorFn, successFn }) {
  return useQuery([userInfoKey], () => getUserInfo(), {
    staleTime: 10 * (60 * 1000), // 10 mins
    cacheTime: 15 * (60 * 1000), // 15 mins
    retry: 0,
    enabled: true,
    refetchOnWindowFocus: false,
    // refetchOnMount: "always",
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    onError: (error) => errorFn(error),
    onSuccess: (data) => successFn(data),
  });
}
