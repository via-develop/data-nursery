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
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/admin/user`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "유저 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가목록
export const getAllFarmListAPI = async (farmhouseIdOrder, nameOrder, statusOrder, page, size) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/auth/farmhouse/list?farmhouse_id_order=${farmhouseIdOrder}&name_order=${nameOrder}&status_order=${statusOrder}&page=${page}&size=${size}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (err) {
    throw new Error(err.response?.status || "전체 농가 목록을 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가추가
export const addFarmhouseAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/create`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 추가하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가수정
export const updateFarmhouseAPI = async (data) => {
  try {
    const res = await axios.patch(process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/update`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가관리 페이지 : 농가삭제
export const deleteFarmhouseAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT + `/api/auth/farmhouse/delete?farmhouse_ids=${data.farmhouseIds}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가를 삭제하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 통계현황 목록
export const getStatics = async (
  year,
  month,
  dateRange,
  farmHouseId,
  farmHouseName,
  cropName,
  cropKindOrderType,
  trayTotal,
  orderQuantityOrderType,
  planterOutputOrderType,
  sowingDateOrderType,
  isShipmentCompletedOrderType,
  page
) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/admin/planter/planter-work/statics?year=${year}&month=${month}&date_range=${dateRange}&farm_house_id=${farmHouseId}&farmhouse_name=${farmHouseName}&crop_name=${cropName}&crop_kind_order_type=${cropKindOrderType}&tray_total=${trayTotal}&order_quantity_order_type=${orderQuantityOrderType}&planter_output_order_type=${planterOutputOrderType}&sowing_date_order_type=${sowingDateOrderType}&is_shipment_completed_order_type=${isShipmentCompletedOrderType}&page=${page}&size=100`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "통계현황 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 농가ID 목록
export const getFarmHouseIdList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/search/farm_house_id?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가ID 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 농가명 목록
export const getFarmHouseNameList = async (searchText) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/search/farmhouse_name?search=${searchText}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가명 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 추가
export const addAdminAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/admin/create`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자를 추가하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 목록
export const getAdminListAPI = async (page, size) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/admin/user/list?page=${page}&size=${size}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자 리스트를 불러오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 수정
export const updateAdminAPI = async (data) => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/admin/update/${data.userId}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//설정 페이지 : 관리자 삭제
export const deleteAdminAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/user/multiple/delete/${data.userIds}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "관리자를 삭제하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가수정 :: 비밀번호 변경
export const updateFarmhousePwAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/admin/auth/farmhouse/update/password?farmhouse_id=${data.farmhouseId}&new_password=${data.newPassword}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "농가비밀번호를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//농가목록 Excel다운로드
export const getFarmhouseListDownloadAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/admin/auth/farmhouse/list/download`, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    throw new Error(err.response?.status || "농가목록 excel 다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

//통계현황 Excel 다운로드
export const getStaticsListDownloadAPI = async (
  year,
  month,
  dateRange,
  farmHouseId,
  farmhouseName,
  cropName,
  trayTotal,
) => {
  try {
    let urlPath = "/api/admin/planter/planter-work/statics/download?";

    if (!!year) {
      urlPath += `year=${year}&`;
    }
    if (!!month) {
      urlPath += `month=${month}&`;
    }
    if (!!dateRange) {
      urlPath += `date_range=${dateRange}&`;
    }
    if (!!farmHouseId) {
      urlPath += `farm_house_id=${farmHouseId}&`;
    }
    if (!!farmhouseName) {
      urlPath += `farmhouse_name=${farmhouseName}&`;
    }
    if (!!cropName) {
      urlPath += `crop_name=${cropName}&`;
    }
    if (!!trayTotal) {
      urlPath += `tray_total=${trayTotal}&`;
    }

    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + urlPath, {
      withCredentials: true,
    });
    return res;
  } catch (err) {
    throw new Error(err.response?.status || "통계현황 excel 다운로드에 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
