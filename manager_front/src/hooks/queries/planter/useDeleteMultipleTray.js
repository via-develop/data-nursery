import { useMutation } from "@tanstack/react-query";

import { deleteMultipleTrayAPI } from "@apis/planterAPIs";

export default function useDeleteMultipleTray(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return deleteMultipleTrayAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
