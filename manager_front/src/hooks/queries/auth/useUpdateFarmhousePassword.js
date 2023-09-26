import { useMutation } from "@tanstack/react-query";

import { updateFarmhousePwAPI } from "@apis/authAPIs";

export default function useUpdateFarmhousePassword(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateFarmhousePwAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
