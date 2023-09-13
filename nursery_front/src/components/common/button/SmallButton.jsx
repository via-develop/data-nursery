import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

const S = {
  ButtonWrap: styled(Button)`
    width: ${(props) => props.width};
    height: 52px;
    padding: 16px 24px !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    font-weight: 700 !important;
    font-size: 18px !important;
    line-height: 20px !important;
    border-radius: 8px !important;

    color: ${(props) => props.fontColor} !important;
    background-color: ${(props) => props.backgroundColor} !important;
    border: 1px solid ${(props) => props.borderColor} !important;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    cursor: ${(props) => (props.fontColor === `#C2D6E1` ? "auto" : "pointer")} !important;

    &:hover {
      background-color: ${(props) => props.hoverBackgroundColor} !important;
      border: 2px solid ${(props) => props.hoverBorderColor} !important;
    }

    &:focus {
      background-color: ${(props) => props.focusBackgroundColor} !important;
      border-color: ${(props) => props.focusBorderColor} !important;
    }
  `,
};

function SmallButton({ width = "100%", text, onClick, customStyle }) {
  return (
    <S.ButtonWrap
      width={width}
      backgroundColor={customStyle.backgroundColor}
      borderColor={customStyle.borderColor}
      hoverBackgroundColor={customStyle.hoverBackgroundColor}
      hoverBorderColor={customStyle.hoverBorderColor}
      focusBackgroundColor={customStyle.focusBackgroundColor}
      focusBorderColor={customStyle.focusBorderColor}
      fontColor={customStyle.fontColor}
      onClick={customStyle.fontColor === "#C2D6E1" ? () => {} : onClick}>
      {text}
    </S.ButtonWrap>
  );
}

export default SmallButton;
