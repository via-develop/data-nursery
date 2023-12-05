import React, { useState } from "react";
import styled from "styled-components";

import MainLayout from "../../components/layout/MainLayout";
import MainHeader from "@components/layout/MainHeader";

import useCropPredict from "@src/hooks/queries/crop/useCropPredict";

import { YYYYMMDDDash } from "@src/utils/Formatting";

import { requireAuthentication } from "@src/utils/LoginCheckAuthentication";
import AiPredictionMain from "@components/prediction/AiPredictionMain";
import BarGraphAiWrap from "@components/prediction/BarGraphAiWrap";
import useCropIdDetail from "@src/hooks/queries/crop/useCropIdDetail";

const S = {
  Wrap: styled.div`
    margin-top: 24px;
    min-width: 1500px;
  `,
};

function Prediction() {
  // 작물 선택 유무
  const [planterClick, setPlanterClick] = useState(false);
  // 어떤 작물 선택
  const [planterChoose, setPlanterChoose] = useState("");

  // 날짜 선택
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date(),
  });

  // 기간내 작물별 생산량 예측값 조회
  const { data: planterData } = useCropPredict({
    dateRange: YYYYMMDDDash(dateRange.startDate) + "||" + YYYYMMDDDash(dateRange.endDate),
    successFn: (res) => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 기간 내 선택 작물 날짜별 파종량 및 총 파종량
  const { data: sowingData } = useCropIdDetail({
    cropId: planterChoose?.crop_id,
    dateRange: YYYYMMDDDash(dateRange.startDate) + "||" + YYYYMMDDDash(dateRange.endDate),
    successFn: (res) => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  return (
    <MainLayout>
      <MainHeader />
      <S.Wrap>
        <AiPredictionMain
          setPlanterClick={setPlanterClick}
          planterChoose={planterChoose}
          setPlanterChoose={setPlanterChoose}
          dateRange={dateRange}
          setDateRange={setDateRange}
          planterData={planterData}
        />
        <BarGraphAiWrap
          planterClick={planterClick}
          planterChoose={planterChoose}
          dateRange={dateRange}
          planterData={planterData}
          sowingData={sowingData}
        />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default Prediction;
