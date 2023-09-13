import { useMutation } from "@tanstack/react-query";

import { addAdminAPI } from "@apis/authAPIs";

export default function useCreateManager(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return addAdminAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
