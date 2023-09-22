import React from "react";
import styled, { css } from "styled-components";

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

    ${(props) =>
      props.readOnly
        ? css`
            background-color: #ffffff;
            border: 1px solid ${({ theme }) => theme.basic.lightSky};
          `
        : css`
            background-color: ${({ theme }) => theme.basic.lightSky};
            border: 2px solid ${({ theme }) => theme.mobile.inputOutline};

            &:focus-within {
              border: 2px solid #5899fb;
            }
          `}
  `,
  CustomInput: styled.input`
    width: 100%;
    flex: 1;
    ${({ theme }) => theme.textStyle.h6Bold}
    color: ${({ theme }) => theme.basic.grey60};
    outline: none;
    border: none;
    box-shadow: none !important;

    &:focus {
      border: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.basic.grey40} !important;
    }

    ${(props) =>
      props.readOnly
        ? css`
            background-color: #ffffff;
          `
        : css`
            background-color: ${({ theme }) => theme.basic.lightSky};
          `}
  `,
  SuffixText: styled.p`
    font-size: 16px;
    font-weight: 400;
    line-height: 20px; /* 125% */
    letter-spacing: -0.32px;
    color: ${({ theme }) => theme.basic.grey50};
    margin-right: 8px;
  `,
};

function SuffixInput({
  text,
  setText,
  type = "text",
  maxLength,
  placeholder,
  inputmode = "text",
  readOnly = false,
  suffix,
}) {
  return (
    <S.InputWrap readOnly={readOnly}>
      <S.CustomInput
        value={text}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        inputmode={inputmode}
        onChange={setText}
        readOnly={readOnly}
      />
      <S.SuffixText>{suffix}</S.SuffixText>
    </S.InputWrap>
  );
}

export default SuffixInput;
