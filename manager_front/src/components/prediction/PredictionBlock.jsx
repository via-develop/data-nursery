import React from "react";
import styled from "styled-components";

import { NumberCommaFormatting } from "@src/utils/Formatting";

import BarIcon from "@images/dashboard/icon-bar.svg";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.blackWhite.white};
    margin-top: 32px;
    padding: 56px 40px 68px 40px;
  `,
  TitleWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    p {
      ${({ theme }) => theme.textStyle.h4Bold}
    }
  `,
  ContentWrap: styled.div`
    display: flex;
    justify-content: space-between;
    gap: 24px;
  `,
  Block: styled.div`
    width: 50%;
    padding: 24px 0px;
    gap: 8px;
    justify-content: center;
    align-items: center;
    height: 112px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    margin-top: 30px;

    p {
      color: ${({ theme }) => theme.basic.darkBlue};
    }
    .title {
      ${({ theme }) => theme.textStyle.h6Reguler};
    }
    .content {
      ${({ theme }) => theme.textStyle.h3Bold};
    }
  `,
};

function PrecitionBlock({ sowingData, planterData, planterChoose }) {
  // AI 예측 파종량 값
  const aiPredict = planterData?.find((item) => item.crop_id === planterChoose?.crop_id)?.ai_predict;

  return (
    <S.Wrap>
      <S.TitleWrap>
        <BarIcon width={5} height={28} />
        <p>AI 생산량 예측</p>
      </S.TitleWrap>
      <S.ContentWrap>
        <S.Block>
          <p className="title">선택 기간 파종량</p>
          <p className="content">{NumberCommaFormatting(sowingData?.total_output)}</p>
        </S.Block>
        <S.Block>
          <p className="title">AI 예측 파종량</p>
          <p className="content">{NumberCommaFormatting(aiPredict)}</p>
        </S.Block>
      </S.ContentWrap>
    </S.Wrap>
  );
}

export default PrecitionBlock;
