import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

import XIcon from "@images/common/icon-x.svg";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 616px;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;
    display: flex;
    flex-direction: column;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }
    .x-icon {
      cursor: pointer;
    }
  `,
  TextWrap: styled.div`
    display: flex;
    justify-content: space-between;

    .input-title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    .input-info {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,
  InputWrap: styled.div`
    display: flex;
    margin-top: 40px;
    gap: 8px;
    flex-direction: column;

    .input-wrap-off {
      width: 100%;
      background-color: ${({ theme }) => theme.blackWhite.white};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};

      input {
        background-color: ${({ theme }) => theme.blackWhite.white};
        border: 1px solid ${({ theme }) => theme.blackWhite.white};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
      }
    }
    .input-wrap {
      width: 100%;
      background-color: ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;

      input {
        background-color: ${({ theme }) => theme.basic.lightSky};
        border: 1px solid ${({ theme }) => theme.basic.lightSky};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray50};
        ${({ theme }) => theme.textStyle.h6Reguler}
      }
      input:focus-visible {
        outline: none;
      }
    }
  `,
  ButtonWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.primery.primery};
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    cursor: pointer;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
  ButtonWrapOff: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      color: ${({ theme }) => theme.basic.gray30};
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
};

function AddTrayModal({
  setAddTrayModalOpen,
  trayWidthNum,
  setTrayWidthNum,
  trayHeighthNum,
  setTrayHeighthNum,
  trayNum,
  setTrayNum,
}) {
  useEffect(() => {
    setTrayNum(trayWidthNum * trayHeighthNum);
  }, [trayWidthNum, trayHeighthNum]);

  const closeModal = useCallback(() => {
    setAddTrayModalOpen(false);
    setTrayWidthNum("");
    setTrayHeighthNum("");
  }, [trayWidthNum, trayHeighthNum]);

  const handleTraySaveClick = useCallback(() => {
    closeModal();
  }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="title">트레이추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <S.TextWrap>
            <p className="input-title">가로</p>
            <p className="input-info">※ 숫자만 입력하세요</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="예) 30"
              value={trayWidthNum}
              onChange={(e) => setTrayWidthNum(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
          <S.TextWrap>
            <p className="input-title">세로</p>
            <p className="input-info">※ 숫자만 입력하세요</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="예) 14"
              value={trayHeighthNum}
              onChange={(e) => setTrayHeighthNum(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>
          <S.TextWrap>
            <p className="input-title">트레이공수</p>
            <p className="input-info">※ 가로,세로값이 입력되면 자동으로 계산됩니다.</p>
          </S.TextWrap>
          <div className="input-wrap-off">
            <input value={trayNum} />
          </div>
        </S.InputWrap>

        {trayWidthNum.length === 0 || trayHeighthNum.length === 0 ? (
          <S.ButtonWrapOff>
            <p>저장</p>
          </S.ButtonWrapOff>
        ) : (
          <S.ButtonWrap onClick={handleTraySaveClick}>
            <p>저장</p>
          </S.ButtonWrap>
        )}
      </S.WrapInner>
    </S.Wrap>
  );
}

export default AddTrayModal;
