import { useMutation } from "@tanstack/react-query";

import { registerWorkAPI } from "@apis/planterAPIs";

export default function useRegisterWork(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return registerWorkAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
