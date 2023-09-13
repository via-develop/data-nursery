import React, { useCallback } from "react";
import styled, { css } from "styled-components";

import SmallButton from "../button/SmallButton";

import { borderButtonColor, defaultButtonColor } from "@utils/ButtonColor";
import WarningIcon from "@images/common/icon-warning.svg";
import PositiveIcon from "@images/common/icon-positive.svg";

const S = {
  BackGroundWrap: styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    z-index: 99;
    top: 0%;
    left: 0%;

    /* ${({ theme }) => theme.media.max_mobile} {
      position: fixed;
    } */
  `,
  Wrap: styled.div`
    max-height: 90vh;
    overflow-y: auto;
    position: absolute;
    z-index: 99;
    top: 50%;
    left: calc(50% - 164px);
    background-color: #ffffff;

    width: 328px;
    border-radius: 8px;
    padding: 40px 32px 32px 32px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    transform: translate3d(0%, -50%, 0);

    /* ${({ theme }) => theme.media.max_mobile} {
      position: fixed;
    } */
  `,
  ModalWrap: styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;

    p {
      white-space: pre-line;
      text-align: center;
    }

    .modal-title-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey60};
      text-align: center;
    }

    .modal-content-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey40};
    }

    .button-wrap {
      display: flex;
      align-items: center;
      margin-top: 16px;
      width: 100%;
      gap: 16px;
    }
  `,
};

function DefaultModal({ modalOpen, setModalOpen }) {
  const closeModal = useCallback(() => {
    if (!!modalOpen.cancelFn) {
      modalOpen.cancelFn();
    }

    setModalOpen({
      open: false, // 오픈 여부
      type: "", // success, error, 빈값
      title: "", // 타이틀 명
      description: "", // 추가 설명
      btnType: "", // one, two
      afterFn: null, // 확인 버튼 클릭 시 실행
      cancelFn: null, // 취소 버튼 클릭 시 실행
    });
  }, []);

  const completeModal = useCallback(() => {
    if (!!modalOpen.afterFn) {
      modalOpen.afterFn();
    }

    closeModal();
  }, [modalOpen.afterFn]);

  return (
    modalOpen.open && (
      <S.BackGroundWrap>
        <S.Wrap>
          <S.ModalWrap>
            {modalOpen?.type === "error" && <WarningIcon />}
            {modalOpen?.type === "success" && <PositiveIcon />}
            <p className="modal-title-text">{modalOpen.title}</p>
            {!!modalOpen.description && <p className="modal-content-text">{modalOpen.description}</p>}
            <div className="button-wrap">
              {modalOpen.btnType === "one" && (
                <SmallButton text={"확인"} onClick={completeModal} customStyle={defaultButtonColor} />
              )}
              {modalOpen.btnType === "two" && (
                <>
                  <SmallButton text={"취소"} onClick={closeModal} customStyle={borderButtonColor} />
                  <SmallButton text={"확인"} onClick={completeModal} customStyle={defaultButtonColor} />
                </>
              )}
            </div>
          </S.ModalWrap>
        </S.Wrap>
      </S.BackGroundWrap>
    )
  );
}

export default DefaultModal;
