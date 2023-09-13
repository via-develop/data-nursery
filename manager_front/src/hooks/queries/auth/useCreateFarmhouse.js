import { useMutation } from "@tanstack/react-query";

import { addFarmhouseAPI } from "@apis/authAPIs";

export default function useCreateFarmhouse(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return addFarmhouseAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
