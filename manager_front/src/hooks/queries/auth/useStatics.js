import { useQuery } from "@tanstack/react-query";

import { getStatics } from "@apis/authAPIs";

import { staticsKey } from "@src/utils/query-keys/AuthQueryKeys";

export default function useStatics({
  year,
  month,
  dateRange,
  farmHouseId,
  farmHouseName,
  cropName,
  cropKindOrderType,
  trayTotal,
  orderQuantityOrderType,
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
      dateRange,
      farmHouseId,
      farmHouseName,
      cropName,
      cropKindOrderType,
      trayTotal,
      orderQuantityOrderType,
      planterOutputOrderType,
      sowingDateOrderType,
      isShipmentCompletedOrderType,
      page,
    ],
    () =>
      getStatics(
        year,
        month,
        dateRange,
        farmHouseId,
        farmHouseName,
        cropName,
        cropKindOrderType,
        trayTotal,
        orderQuantityOrderType,
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
      refetchOnMount: "always",
      refetchOnReconnect: false,
      refetchInterval: false,
      onError: (error) => errorFn(error),
      onSuccess: (data) => successFn(data),
    },
  );
}
