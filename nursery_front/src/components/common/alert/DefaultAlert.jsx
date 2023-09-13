import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { Button, Alert } from "react-bootstrap";

import { isDefaultAlertShowState } from "@states/isDefaultAlertShowState";
import SuccessIcon from "@images/common/alert-success.svg";
import ErrorIcon from "@images/common/alert-error.svg";

const S = {
  StyledAlert: styled(Alert)`
    position: absolute !important;
    left: 50%;
    bottom: 16px;
    transform: translate(-50%, 0);
    z-index: 999 !important;
    width: calc(100% - 32px);
    height: 64px;
    /* max-width: 90%; */
    padding: 20px 24px !important;
    margin: 0px !important;

    background-color: ${({ theme }) => theme.basic.grey60} !important;
    border-radius: 8px;
    border: none !important;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    .text-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    p {
      font-size: 18px !important;
      line-height: 24px !important;
      font-weight: 300 !important;
      white-space: pre-line;
      word-break: keep-all;
      color: #fff;
    }
  `,
  OkButton: styled(Button)`
    width: 75px;
    height: 40px;
    padding: 8px 24px !important;

    display: flex;
    align-items: center;
    justify-content: center;

    ${({ theme }) => theme.textStyle.h5Regular}
    border-radius: 8px !important;
    border: none !important;

    color: #ffffff !important;
    background-color: ${({ theme }) => theme.basic.grey50} !important;
  `,
};

function DefaultAlert() {
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  useEffect(() => {
    let checkTime = undefined;

    if (!!isDefaultAlertShow.text) {
      if (isDefaultAlertShow.isShow) {
        checkTime = setTimeout(() => {
          setIsDefaultAlertShowState((prev) => ({
            ...prev,
            isShow: false,
          }));
        }, 3000);
      }
    }

    return () => {
      if (!!checkTime) {
        clearTimeout(checkTime);
      }
    };
  }, [isDefaultAlertShow.isShow]);

  const handleOkClick = useCallback(() => {
    isDefaultAlertShow.okClick();
    setIsDefaultAlertShowState((prev) => ({
      ...prev,
      isShow: false,
    }));
  }, [isDefaultAlertShow.okClick]);

  // const portalDiv = typeof window !== "undefined" ? document.querySelector("#default-alert") : null;

  // if (!portalDiv) return null;

  return (
    isDefaultAlertShow.isShow && (
      // createPortal(
      <S.StyledAlert show={isDefaultAlertShow.isShow} type={isDefaultAlertShow.type}>
        <div className="text-wrap">
          {isDefaultAlertShow.type === "success" && <SuccessIcon />}
          {isDefaultAlertShow.type === "error" && <ErrorIcon width={24} height={24} fill={"#FF7D60"} />}
          <p>{isDefaultAlertShow.text}</p>
        </div>
        {isDefaultAlertShow.type === "error" && <S.OkButton onClick={handleOkClick}>OK</S.OkButton>}
      </S.StyledAlert>
    )
    // document.querySelector("#default-alert"),
    // )
  );
}

export default DefaultAlert;
