import axios from "axios";

// 작물명 목록
export const getCropNameList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/crop/search/crop_name?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작물명 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작물 목록
export const getCropListAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/crop/list`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작물 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작물 추가
export const createCropAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/crop/create`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "작물 등록에 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작물정보 수정 및 삭제
export const updateCropAPI = async (data) => {
  try {
    const res = await axios.patch(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/crop/update/${data.cropId}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    if (!!data.is_del) {
      throw new Error(error.response?.status || "작물 삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.");
    } else {
      throw new Error(error.response?.status || "작물정보를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
    }
  }
};

// 작물 다중 삭제
export const deleteMultipleCropAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/crop/multiple/delete/${data.deleteCrop}`,
      {},
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "작물 삭제에 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
