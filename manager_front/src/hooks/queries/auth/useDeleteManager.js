import { useMutation } from "@tanstack/react-query";

import { deleteAdminAPI } from "@apis/authAPIs";

export default function useDeleteManager(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return deleteAdminAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
