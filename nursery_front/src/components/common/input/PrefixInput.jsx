import React from "react";
import styled from "styled-components";

import IdIcon from "@images/login/id-icon.svg";
import PasswordIcon from "@images/login/password-icon.svg";

const S = {
  InputWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    flex: 1;
    height: 60px !important;
    max-height: 60px !important;
    background-color: #fff;
    border-radius: 8px;
    padding: 20px 24px 20px 16px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    gap: 10px;

    /* &:focus-within {
      border-color: ${({ theme }) => theme.secondery};
    } */
  `,
  CustomInput: styled.input`
    width: 100%;
    flex: 1;
    font-size: 16px;
    line-height: 18px;
    font-weight: 700;
    color: ${({ theme }) => theme.basic.grey60};
    outline: none;
    border: none;
    box-shadow: none !important;

    &:focus {
      border: none;
    }

    &::placeholder {
      color: ${({ theme }) => theme.basic.grey40} !important;
      font-size: 18px;
      line-height: 24px;
      font-weight: 400;
    }
  `,
};

function PrefixInput({ text, setText, type = "text", maxLength, placeholder, enterKeyUpFn }) {
  return (
    <S.InputWrap>
      {type === "text" ? <IdIcon /> : <PasswordIcon />}
      <S.CustomInput
        value={text}
        type={type}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={setText}
        onKeyUp={!!enterKeyUpFn ? enterKeyUpFn : null}
      />
    </S.InputWrap>
  );
}

export default PrefixInput;
