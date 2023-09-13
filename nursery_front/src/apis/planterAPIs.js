import axios from "axios";

// 파종기 등록
export const registerPlanter = async (data) => {
  try {
    const res = await axios.post(
      process.env.NEXT_PUBLIC_END_POINT + `/api/planter/farmhouse/register?serial_number=${data.serial_number}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "파종기를 등록하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 트레이 목록
export const getTrayListAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/tray/list`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "트레이 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 대시보드 정보 (오늘의 생산량, BEST품종, 사용시간)
export const getDashBoardAPI = async () => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/today/dashboard`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "대시보드 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 진행중인 작업 목록
export const getWorkingWorkInfoAPI = async (serialNumber) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/work/working/list/${serialNumber}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.status || "진행중인 작업 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.",
    );
  }
};

// 대기중인 작업 목록
export const getWaitWorkListAPI = async (serialNumber, page) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT + `/api/planter/work/wait/list/${serialNumber}?page=${page}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.status || "대기중인 작업 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.",
    );
  }
};

// 작업 상태 변경
export const updateWorkStatusAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/planter/work/status/update/${data.planter_work_id}?status=${data.status}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작업 상태를 변경하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작업 등록
export const registerWorkAPI = async (data) => {
  try {
    const res = await axios.post(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/work/create`, data, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작업을 등록하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작업정보수정
export const updateWorkAPI = async (data) => {
  try {
    const res = await axios.patch(
      process.env.NEXT_PUBLIC_END_POINT + `/api/planter/work/info/update/${data.workId}`,
      data,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작업정보를 수정하는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작업 정보
export const getWorkInfoAPI = async (workId) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/work/info/${workId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작업 정보를 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 작업이력 목록
export const getWorkHistoryListAPI = async (serialNumber, year, month, date, page) => {
  try {
    const res = await axios.get(
      process.env.NEXT_PUBLIC_END_POINT +
        `/api/planter/work/done/list/${serialNumber}/${year}/${month}/${date}?page=${page}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "작업이력 목록을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};

// 통계현황
export const getStatisticsAPI = async (year, month) => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_END_POINT + `/api/planter/month/statics/${year}/${month}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.status || "통계현황을 가져오는데 실패하였습니다. 잠시 후 다시 시도해주세요.");
  }
};
