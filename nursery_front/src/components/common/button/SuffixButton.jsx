import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import ArrowRightIcon from "@images/common/chevron-right.svg";

const S = {
  ButtonWrap: styled(Button)`
    width: 84px;
    height: 56px;
    padding: 16px 8px 16px 16px !important;

    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;

    border-radius: 8px !important;

    background-color: ${(props) => props.backgroundColor} !important;
    border: 2px solid ${(props) => props.borderColor} !important;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    cursor: ${(props) => (props.fontColor === `#C2D6E1` ? "auto" : "pointer")} !important;

    &:hover {
      background-color: ${(props) => props.hoverBackgroundColor} !important;
      border-color: ${(props) => props.hoverBorderColor} !important;
    }

    &:focus {
      background-color: ${(props) => props.focusBackgroundColor} !important;
      border-color: ${(props) => props.focusBorderColor} !important;
    }

    .button-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${(props) => props.fontColor} !important;
    }
  `,
};

function SuffixButton({ text, onClick, customStyle }) {
  return (
    <S.ButtonWrap
      backgroundColor={customStyle.backgroundColor}
      borderColor={customStyle.borderColor}
      hoverBackgroundColor={customStyle.hoverBackgroundColor}
      hoverBorderColor={customStyle.hoverBorderColor}
      focusBackgroundColor={customStyle.focusBackgroundColor}
      focusBorderColor={customStyle.focusBorderColor}
      fontColor={customStyle.fontColor}
      onClick={customStyle.fontColor === "#C2D6E1" ? () => {} : onClick}>
      <p className="button-text">{text}</p>
      <ArrowRightIcon />
    </S.ButtonWrap>
  );
}

export default SuffixButton;
