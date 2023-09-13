import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import { QRCodeCanvas } from "qrcode.react";

import XIcon from "@images/common/icon-x.svg";
import Refresh from "@images/management/refresh.svg";

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
    min-height: 354px;
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
    .sub-title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
    }
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }

    .x-icon {
      cursor: pointer;
    }
  `,
  InputWrap: styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;

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

    .title-info {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Reguler}

      b {
        ${({ theme }) => theme.textStyle.h6Bold}
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
  QrCodeWrap: styled.div`
    margin-top: 16px;
    padding: 24px 0px;
    display: flex;
    flex-direction: column;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    justify-content: center;
    align-items: center;
    gap: 16px;

    .qr-inner {
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;
      padding: 11.49px;
      gap: 8.61px;
      background-color: ${({ theme }) => theme.blackWhite.white};

      p {
        color: ${({ theme }) => theme.basic.gray40};
        font-size: 22.972px;
        font-weight: 600;
        line-height: normal;
      }
    }

    .reset-button {
      cursor: pointer;
      width: fit-content;
      display: flex;
      gap: 16px;
      padding: 8px 32px;
      background-color: ${({ theme }) => theme.basic.whiteGray};
      box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
      justify-content: center;
      align-items: center;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h6Bold}
      }
    }
  `,
};

function AddFarmModal({
  setAddFarmModalOpen,
  addFarmSerialNumber,
  setAddFarmSerialNumber,
  createQrcode,
  setCreateQrcode,
  setAddFarmSaveModalOpen,
  qrCodeUrl,
  setQrCodeUrl,
}) {
  const closeModal = useCallback(() => {
    setAddFarmModalOpen(false);
    setCreateQrcode(false);
    setAddFarmSerialNumber("");
    setQrCodeUrl("");
  }, [qrCodeUrl, createQrcode]);

  const addQrCodeClick = useCallback(() => {
    setCreateQrcode(true);
  }, [createQrcode]);

  const qrCodeNextClick = useCallback(() => {
    setAddFarmModalOpen(false);
    setAddFarmSaveModalOpen({ open: true, serialNumber: addFarmSerialNumber });
    qrUrlDown();
  }, []);

  //큐알코드
  const qrRef = useRef();
  const qrcode = <QRCodeCanvas id="qrCode" value={addFarmSerialNumber} size={231} bgColor={"#ffffff"} level={"H"} />;

  const qrUrlDown = useCallback(() => {
    if (qrRef.current) {
      // 캔버스 요소를 얻습니다.
      const canvas = qrRef.current.querySelector("canvas");

      if (canvas) {
        // 캔버스를 이미지로 변환합니다.
        const imgURL = canvas.toDataURL("image/png");
        setQrCodeUrl(imgURL);
      }
    }
  }, [qrRef, qrCodeUrl]);

  const handleQRcodeResetClick = useCallback(() => {
    alert("큐알코드 리셋 버튼 구현중");
  }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="sub-title">STEP 1</p>
            <p className="title">농가추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <p className="title-info">
            파종기 시리얼번호를 입력하여 <b>QR 코드를 생성하세요</b>
          </p>
          {createQrcode ? (
            <>
              <div className="input-wrap-off">
                <input value={addFarmSerialNumber} disabled />
              </div>
            </>
          ) : (
            <>
              <div className="input-wrap">
                <input
                  placeholder="시리얼번호를 입력하세요"
                  value={addFarmSerialNumber}
                  onChange={(e) => setAddFarmSerialNumber(e.target.value)}
                />
              </div>
            </>
          )}
        </S.InputWrap>
        {createQrcode && (
          <S.QrCodeWrap>
            <div className="qr-inner">
              <div className="qrcode__container">
                <div ref={qrRef}>{qrcode}</div>
              </div>

              <p>SCAN ME!</p>
            </div>
            <div className="reset-button" onClick={handleQRcodeResetClick}>
              <div className="img">
                <Refresh width={24} height={24} />
              </div>
              <p>초기화</p>
            </div>
          </S.QrCodeWrap>
        )}

        {createQrcode ? (
          <>
            <S.ButtonWrap onClick={qrCodeNextClick}>
              <p>다음</p>
            </S.ButtonWrap>
          </>
        ) : (
          <>
            {addFarmSerialNumber.length !== 0 ? (
              <S.ButtonWrap onClick={addQrCodeClick}>
                <p>QR 코드 생성</p>
              </S.ButtonWrap>
            ) : (
              <S.ButtonWrapOff>
                <p>QR 코드 생성</p>
              </S.ButtonWrapOff>
            )}
          </>
        )}
      </S.WrapInner>
    </S.Wrap>
  );
}

export default AddFarmModal;
