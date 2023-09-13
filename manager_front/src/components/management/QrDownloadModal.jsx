import React, { useCallback } from "react";
import styled from "styled-components";

import { saveAs } from "file-saver";

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
  InputWrap: styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .input-wrap {
      width: 100%;
      background-color: #fff;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;

      .input-inner {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      input {
        background-color: #fff;
        border: 1px solid #fff;
        width: 100%;
        color: ${({ theme }) => theme.basic.gray50};
        ${({ theme }) => theme.textStyle.h6Bold}
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
      margin-bottom: 8px;
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
      color: ${({ theme }) => theme.blackWhite.white} !important;
      ${({ theme }) => theme.textStyle.h5Bold};
    }
  `,
  QrCodWrap: styled.div`
    padding: 24px 0px;
    display: flex;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border-radius: 8px;
    align-items: center;
    justify-content: center;
    margin-top: 16px;

    .qrcode-inner {
      width: 257px;
      height: 290px;
      padding: 11.49px;
      display: flex;
      flex-direction: column;
      gap: 8.61px;
      background-color: ${({ theme }) => theme.blackWhite.white};
      justify-content: center;
      align-items: center;
    }
    .qrcode {
      width: 234px;
      height: 231px;
    }

    p {
      color: ${({ theme }) => theme.basic.gray40};
      font-size: 22.972px;
      font-weight: 600;
      line-height: normal;
      font-style: normal;
    }
  `,
};

function QrDownloadModal({ qrDownloadModalOpen, setQrDownloadModalOpen }) {
  const closeModal = useCallback(() => {
    setQrDownloadModalOpen({ open: false, data: undefined });
  }, []);

  console.log("qrDownloadModalOpen", qrDownloadModalOpen);

  const qrImage = "http://localhost:8000" + qrDownloadModalOpen?.data?.data?.planter?.qrcode;
  // const qrImage = "http://localhost:8000" + qrDownloadModalOpen?.data?.data?.qr_image;

  console.log("qrImage", qrImage);

  const qrCodeDownloadClick = useCallback(() => {
    let url = qrImage;
    saveAs(url, qrDownloadModalOpen?.data?.data?.planter?.serial_number + "-qrcode");
  }, [qrImage]);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="title">QR다운로드</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <div className="input-inner">
            <p className="title-info">농가명</p>
            <div className="input-wrap">
              <input value={qrDownloadModalOpen.data.data.name} />
            </div>
          </div>
          <div className="input-inner">
            <p className="title-info">
              파종기 시리얼번호를 입력하여 <b>QR 코드를 생성하세요</b>
            </p>
            <div className="input-wrap">
              <input value={qrDownloadModalOpen.data.data.serial_number} />
            </div>
          </div>
        </S.InputWrap>
        <S.QrCodWrap>
          <div className="qrcode-inner">
            <img src={qrImage} alt="qrcode-img" className="qrcode" />
            <p>SCAN ME!</p>
          </div>
        </S.QrCodWrap>
        <S.ButtonWrap onClick={qrCodeDownloadClick}>
          <p>다운로드</p>
        </S.ButtonWrap>
      </S.WrapInner>
    </S.Wrap>
  );
}

export default QrDownloadModal;
