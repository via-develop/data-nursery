import { useMutation } from "@tanstack/react-query";

import { updateCropAPI } from "@apis/cropAPIs";

export default function useUpdateCrop(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return updateCropAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
