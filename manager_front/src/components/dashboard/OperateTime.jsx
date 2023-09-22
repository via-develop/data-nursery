import React, { useState } from "react";
import styled from "styled-components";

import Toggle from "./Toggle";
import BarIcon from "@images/dashboard/icon-bar.svg";
import GraphOperateTimeMonth from "./GraphOperateTimeMonth";
import GraphOperateTimeDay from "./GraphOperateTimeDay";

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
  GraphWrap: styled.div``,
};

function OperateTime({ currentDate }) {
  const [isSelectedLeft, setIsSelectedLeft] = useState(false);
  const [isSelectedRight, setIsSelectedRight] = useState(true);

  const leftToggle = "전일";
  const rightToggle = "전월";

  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.TextWrap>
          <BarIcon width={5} height={28} />
          <p className="title">파종기 가동시간</p>
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
        {isSelectedLeft && <GraphOperateTimeDay />}
        {isSelectedRight && <GraphOperateTimeMonth />}
      </S.GraphWrap>
    </S.Wrap>
  );
}

export default OperateTime;
