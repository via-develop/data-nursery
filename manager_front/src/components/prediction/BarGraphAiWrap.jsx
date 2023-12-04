import React from "react";
import styled from "styled-components";

import PredictionBlock from "./PredictionBlock";
import GraphWrap from "./GraphWrap";

import PlantIcon from "@images/setting/plant-no-data.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  `,
  NoPlant: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    justify-content: center;

    p {
      ${({ theme }) => theme.textStyle.h5Reguler};
      color: ${({ theme }) => theme.basic.gray50};
    }
  `,
};

function BarGraphAiWrap({ planterClick, planterChoose, dateRange, planterData, sowingData }) {
  return (
    <S.Wrap>
      {planterClick ? (
        <>
          <GraphWrap planterChoose={planterChoose} sowingData={sowingData} dateRange={dateRange} />
          <PredictionBlock planterData={planterData} sowingData={sowingData} planterChoose={planterChoose} />
        </>
      ) : (
        <S.NoPlant>
          <PlantIcon width={41} height={43} />
          <p>작물을 선택하면 자세한 정보를 확인할 수 있어요</p>
        </S.NoPlant>
      )}
    </S.Wrap>
  );
}

export default BarGraphAiWrap;
