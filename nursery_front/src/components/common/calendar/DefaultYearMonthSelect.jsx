import React from "react";
import styled, { css } from "styled-components";

import theme from "@src/styles/theme";
import SelectIcon from "@images/common/select-icon.svg";

const S = {
  SelectWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 24px;
  `,
  DateWrap: styled.div`
    width: fit-content;
    height: 28px;
    display: flex;
    align-items: center;
    gap: 14px;
    cursor: pointer;

    .date-text {
      ${({ theme }) => theme.textStyle.h4Bold}
      color: #ffffff;
    }
  `,
  ArrowWrap: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteAlpha20};
    border-radius: 8px;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.isSelectOpen
        ? css`
            transform: rotate(180deg);
          `
        : css`
            transform: rotate(0deg);
          `}
  `,
};

function DefaultYearMonthSelect({ date, yearMonthOpen, handleYearMonthOpen }) {
  return (
    <S.SelectWrap>
      <S.DateWrap
        onClick={() => {
          handleYearMonthOpen("year", true);
        }}>
        <p className="date-text">{date.year}년</p>
        <S.ArrowWrap isSelectOpen={yearMonthOpen.year}>
          <SelectIcon fill={theme.basic.whiteGrey} />
        </S.ArrowWrap>
      </S.DateWrap>
      <S.DateWrap
        onClick={() => {
          handleYearMonthOpen("month", true);
        }}>
        <p className="date-text">{date.month === 0 ? "전체" : date.month + "월"}</p>
        <S.ArrowWrap isSelectOpen={yearMonthOpen.month}>
          <SelectIcon fill={theme.basic.whiteGrey} />
        </S.ArrowWrap>
      </S.DateWrap>
    </S.SelectWrap>
  );
}

export default DefaultYearMonthSelect;
