import { useMutation } from "@tanstack/react-query";

import { deleteMultipleCropAPI } from "@apis/cropAPIs";

export default function useDeleteMultipleCrop(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return deleteMultipleCropAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
