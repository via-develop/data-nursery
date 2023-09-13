import { useMutation } from "@tanstack/react-query";

import { updateTrayAPI } from "@apis/planterAPIs";

export default function useUpdateTray(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateTrayAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
