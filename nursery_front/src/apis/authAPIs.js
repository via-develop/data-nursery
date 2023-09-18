import axios from "axios";

export const loginAPI = (data) => {
  return axios.post(process.env.NEXT_PUBLIC_END_POINT + "/api/auth/login", data, { withCredentials: true });
};

export const logoutAPI = (data) => {
  return axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/logout?l_type=${data.lType}`, data, {
    withCredentials: true,
  });
};

export const getUserInfo = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/common/user`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "유저 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

export const getUserInfoUrl = () => {
  return process.env.NEXT_PUBLIC_END_POINT + `/api/auth/common/user`;
};
