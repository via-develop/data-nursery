import React, { useState, useEffect } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";
import StatisticsStatus from "@components/statistics/StatisticsStatus";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    min-width: 1500px;
  `,
};

function Statistics() {
  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap>
        <StatisticsStatus />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Statistics;
