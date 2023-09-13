import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import OutlineBlock from "@components/dashboard/OutlineBlock";
import OperationStatus from "@components/dashboard/OperationStatus";
import TotalProduction from "@components/dashboard/TotalProduction";
import GraphCropProduction from "@components/dashboard/CropProduction";
import FarmHouseProduction from "@components/dashboard/FarmHouseProduction";
import OperateTime from "@components/dashboard/OperateTime";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 1500px;
  `,
  Line: styled.div`
    display: flex;
    width: 100%;
    gap: 32px;
  `,
};

// 현재날짜 + 시간
function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// 현재날짜
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
}

function Dashboard() {
  // 현재시간
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());
  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
      setCurrentDate(getCurrentDate());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(intervalId);
  }, []);

  return (
    <MainLayout>
      <MainHeader currentDateTime={currentDateTime} />
      <S.Wrap>
        <OutlineBlock />
        <OperationStatus currentDate={currentDate} />
        <S.Line>
          <TotalProduction currentDate={currentDate} />
          <GraphCropProduction currentDate={currentDate} />
        </S.Line>
        <S.Line>
          <FarmHouseProduction currentDate={currentDate} />
          <OperateTime currentDate={currentDate} />
        </S.Line>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Dashboard;
