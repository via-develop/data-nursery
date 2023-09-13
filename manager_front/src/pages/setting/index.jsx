import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import ManagementList from "@components/setting/ManagementList";
import CropsList from "@components/setting/CropsList";
import TrayList from "@components/setting/TrayList";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 72px;
    min-width: 1500px;
  `,
  BottomWrap: styled.div`
    display: flex;
    gap: 72px;
    justify-content: space-between;
    /* min-width: 1500px; */
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

function Setting() {
  // 현재시간
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentDateTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(intervalId);
  }, []);

  return (
    <MainLayout>
      <MainHeader currentDateTime={currentDateTime} />
      <S.Wrap>
        <ManagementList />
        <S.BottomWrap>
          <CropsList />
          <TrayList />
        </S.BottomWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Setting;
