import { useMutation } from "@tanstack/react-query";

import { createTrayAPI } from "@apis/planterAPIs";

export default function useCreateTray(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return createTrayAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
