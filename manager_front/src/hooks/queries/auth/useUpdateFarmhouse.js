import { useMutation } from "@tanstack/react-query";

import { updateFarmhouseAPI } from "@apis/authAPIs";

export default function useUpdateFarmhouse(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateFarmhouseAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
