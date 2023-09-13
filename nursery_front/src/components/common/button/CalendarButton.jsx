import React from "react";
import styled from "styled-components";
import { Button } from "react-bootstrap";

import CalendarIcon from "@images/work/calendar-icon.svg";

const S = {
  ButtonWrap: styled(Button)`
    width: 100%;
    height: 52px;

    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;

    background-color: ${({ theme }) => theme.basic.lightSky} !important;
    border: 2px solid ${({ theme }) => theme.mobile.inputOutline} !important;
    border-radius: 8px !important;

    padding: 6px 8px 6px 16px !important;
    font-size: 18px !important;
    font-weight: 700 !important;
    line-height: 20px !important;
    color: ${({ theme }) => theme.basic.grey60} !important;

    &:focus {
      border: 2px solid #5899fb !important;
    }

    svg {
      margin-right: 6px;
    }
  `,
};

function CalendarButton({ text, onClick }) {
  return (
    <S.ButtonWrap onClick={onClick}>
      {text}
      <CalendarIcon />
    </S.ButtonWrap>
  );
}

export default CalendarButton;
