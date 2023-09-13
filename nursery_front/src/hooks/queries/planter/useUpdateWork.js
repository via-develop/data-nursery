import { useMutation } from "@tanstack/react-query";

import { updateWorkAPI } from "@apis/planterAPIs";

export default function useUpdateWork(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateWorkAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
