import { useMutation } from "@tanstack/react-query";

import { updateWorkStatusAPI } from "@apis/planterAPIs";

export default function useUpdateWorkStatus(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateWorkStatusAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
