import { useMutation } from "@tanstack/react-query";

import { updateAdminAPI } from "@apis/authAPIs";

export default function useUpdateManager(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateAdminAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
