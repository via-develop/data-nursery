import React from "react";
import styled, { css } from "styled-components";

const S = {
  InputWrap: styled.input`
    width: 100%;
    flex: 1;
    min-height: 52px !important;
    max-height: 52px !important;
    height: 52px !important;
    border-radius: 8px;
    padding: 6px 8px 6px 16px;
    ${({ theme }) => theme.textStyle.h6Bold}
    outline: none;
    box-shadow: none !important;
    color: ${({ theme }) => theme.basic.grey60};

    &::placeholder {
      color: ${({ theme }) => theme.basic.grey40} !important;
    }

    ${(props) =>
      props.readOnly
        ? css`
            background-color: #ffffff;
            border: 1px solid ${({ theme }) => theme.basic.lightSky};
          `
        : css`
            background-color: ${({ theme }) => theme.basic.lightSky};
            border: 2px solid ${({ theme }) => theme.mobile.inputOutline};

            &:focus {
              border: 2px solid #5899fb;
            }
          `}
  `,
};

function DefaultInput({ text, setText, type = "text", maxLength, placeholder, readOnly = false }) {
  return (
    <S.InputWrap
      value={text}
      type={type}
      maxLength={maxLength}
      placeholder={placeholder}
      onChange={setText}
      readOnly={readOnly}
    />
  );
}

export default DefaultInput;
