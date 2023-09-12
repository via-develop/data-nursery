import { useQuery } from "@tanstack/react-query";

import { getStatics } from "@apis/authAPIs";

import { staticsKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useStatics({
  year,
  month,
  day,
  farmHouseId,
  farmHouseName,
  cropName,
  cropKindOrderType,
  trayTotal,
  seedQuantityOrderType,
  planterOutputOrderType,
  sowingDateOrderType,
  isShipmentCompletedOrderType,
  page,
  errorFn,
  successFn,
}) {
  return useQuery(
    [
      staticsKey,
      year,
      month,
      day,
      farmHouseId,
      farmHouseName,
      cropName,
      cropKindOrderType,
      trayTotal,
      seedQuantityOrderType,
      planterOutputOrderType,
      sowingDateOrderType,
      isShipmentCompletedOrderType,
      page,
    ],
    () =>
      getStatics(
        year,
        month,
        day,
        farmHouseId,
        farmHouseName,
        cropName,
        cropKindOrderType,
        trayTotal,
        seedQuantityOrderType,
        planterOutputOrderType,
        sowingDateOrderType,
        isShipmentCompletedOrderType,
        page,
      ),
    {
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
    },
  );
}