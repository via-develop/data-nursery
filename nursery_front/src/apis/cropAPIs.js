import axios from "axios";

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
