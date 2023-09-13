import React from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import { NumberCommaFormatting, NumberUnitFormatting } from "@src/utils/Formatting";

import usePlanterStatus from "@src/hooks/queries/planter/usePlanterStatus";

import FarmHouseIcon from "@images/dashboard/farm-house-icon.svg";
import CropsIcon from "@images/dashboard/crops-icon.svg";
import PlanterIcon from "@images/dashboard/planter-icon.svg";
import AmountIcon from "@images/dashboard/amount-icon.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    gap: 16px;
    justify-content: space-between;
  `,
  TextWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;

    .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #fff;
    }

    .num {
      font-size: 32px;
      font-weight: 700;
      line-height: 36px;
      color: #fff;
    }
  `,

  FarmhouseBlock: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #ffb78e;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 70px;
  `,

  CropsBlock: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #967ae4;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 70px;
  `,
  PlanterBlock: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #4b64ba;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 70px;
  `,
  AmountBlock: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #ffb78e;
    padding: 23px 32px;
    width: 100%;
    height: 112px;
    border-radius: 8px;
    justify-content: center;
    align-items: center;
    display: flex;
    gap: 70px;
  `,

  AmountNumberTooltip: styled(Tooltip)`
    border-radius: 8px !important;
    background-color: #4f5b6c !important;
    border: 1px solid #4f5b6c !important;
    padding: 12px 16px;

    .text-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .title {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #c2d6e1;
    }

    .count-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .count {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      color: #fff;
    }

    .unit {
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      color: #fff;
    }
  `,
};

function OutlineBlock() {
  const { data: planterStatus } = usePlanterStatus({
    successFn: () => {},
    errorFn: (err) => {
      console.log("!!err", err);
    },
  });

  return (
    <S.Wrap>
      <S.FarmhouseBlock>
        <div className="img">
          <FarmHouseIcon width={64} height={64} />
        </div>
        <S.TextWrap>
          <p className="title">농가수</p>
          <p className="num">{planterStatus?.farmhouse_count}</p>
        </S.TextWrap>
      </S.FarmhouseBlock>
      <S.CropsBlock>
        <div className="img">
          <CropsIcon width={64} height={64} />
        </div>
        <S.TextWrap>
          <p className="title">작물수</p>
          <p className="num">{planterStatus?.crop_count}</p>
        </S.TextWrap>
      </S.CropsBlock>
      <S.PlanterBlock>
        <div className="img">
          <PlanterIcon width={64} height={64} />
        </div>
        <S.TextWrap>
          <p className="title">파종기</p>
          <p className="num">{planterStatus?.planter_count}</p>
        </S.TextWrap>
      </S.PlanterBlock>
      <S.AmountBlock>
        <div className="img">
          <AmountIcon width={64} height={64} />
        </div>
        <S.TextWrap>
          <p className="title">누적파종량</p>
          <div id="hover-icon">
            <p className="num">{NumberUnitFormatting(planterStatus?.total_output)}</p>
          </div>
        </S.TextWrap>
      </S.AmountBlock>
      <S.AmountNumberTooltip
        anchorId="hover-icon"
        place="bottom"
        content={
          <div className="text-wrap">
            <p className="title">누적파종량</p>
            <div className="count-wrap">
              <p className="count">{NumberCommaFormatting(planterStatus?.total_output)}</p>
              <p className="unit">개</p>
            </div>
          </div>
        }
      />
    </S.Wrap>
  );
}

export default OutlineBlock;
