import { useMutation } from "@tanstack/react-query";

import { createCropAPI } from "@apis/cropAPIs";

export default function useCreateCrop(successFn, errorFn) {
  return useMutation(
    ({ data }) => {
      return createCropAPI(data);
    },
    {
      onSuccess: (data) => successFn(data),
      onError: (error) => {
        errorFn(error);
      },
    },
  );
}
