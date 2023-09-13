import React from "react";
import styled, { css } from "styled-components";

import SelectIcon from "@images/common/select-icon.svg";
import theme from "@src/styles/theme";

const S = {
  InputWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    min-height: 52px !important;
    max-height: 52px !important;
    height: 52px !important;
    border-radius: 8px;
    padding: 6px 8px 6px 16px;
    gap: 10px;

    background-color: ${({ theme }) => theme.basic.lightSky};
    cursor: pointer;

    .select-text {
      width: 100%;
      flex: 1;
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }

    ${(props) =>
      props.isSelectOpen
        ? css`
            border: 2px solid #5899fb;
          `
        : css`
            border: 2px solid ${({ theme }) => theme.mobile.inputOutline};
          `}

    ${(props) =>
      props.isSelected
        ? css`
            .select-text {
              color: ${({ theme }) => theme.basic.grey60};
            }
          `
        : css`
            .select-text {
              color: ${({ theme }) => theme.basic.grey40};
            }
          `}
  `,
  SelectIconWrap: styled.div`
    padding: 8px;

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

function DefaultSelect({ isSelected, text, isSelectOpen, onClick }) {
  return (
    <S.InputWrap isSelectOpen={isSelectOpen} onClick={onClick} isSelected={isSelected}>
      <p className="select-text">{text}</p>
      <S.SelectIconWrap isSelectOpen={isSelectOpen}>
        <SelectIcon fill={theme.basic.grey50} />
      </S.SelectIconWrap>
    </S.InputWrap>
  );
}

export default DefaultSelect;
