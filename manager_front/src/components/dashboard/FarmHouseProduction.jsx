import React, { useState } from "react";
import styled from "styled-components";

import Toggle from "./Toggle";
import BarIcon from "@images/dashboard/icon-bar.svg";
import GraphFarmHouseProductionMonth from "./GraphFarmHouseProductionMonth";
import GraphFarmHouseProductionDay from "./GraphFarmHouseProductionDay";

const S = {
  Wrap: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border-radius: 8px;
    width: 100%;
    padding: 56px 40px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  TextWrap: styled.div`
    display: flex;
    justify-content: start;
    align-items: flex-end;
    gap: 16px;

    .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .status-date {
      color: #929fa6;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
    }
  `,
  GraphWrap: styled.div`
    padding: 64px 0px 24px 0px;
    border-radius: 8px;
    border: 1px solid #c2d6e1;
  `,
};

function FarmHouseProduction({ currentDate }) {
  const [isSelectedLeft, setIsSelectedLeft] = useState(false);
  const [isSelectedRight, setIsSelectedRight] = useState(true);

  const leftToggle = "당일";
  const rightToggle = "당월";

  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.TextWrap>
          <BarIcon width={5} height={28} />
          <p className="title">농가별 생산량</p>
          <p className="status-date">{currentDate}</p>
        </S.TextWrap>
        <Toggle
          isSelectedLeft={isSelectedLeft}
          setIsSelectedLeft={setIsSelectedLeft}
          isSelectedRight={isSelectedRight}
          setIsSelectedRight={setIsSelectedRight}
          leftToggle={leftToggle}
          rightToggle={rightToggle}
        />
      </S.TitleWrap>
      <S.GraphWrap>
        {isSelectedLeft && <GraphFarmHouseProductionDay />}
        {isSelectedRight && <GraphFarmHouseProductionMonth />}
      </S.GraphWrap>
    </S.Wrap>
  );
}

export default FarmHouseProduction;
