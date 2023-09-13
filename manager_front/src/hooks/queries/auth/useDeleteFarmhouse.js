import { useMutation } from "@tanstack/react-query";

import { deleteFarmhouseAPI } from "@apis/authAPIs";

export default function useDeleteFarmhouse(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return deleteFarmhouseAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
