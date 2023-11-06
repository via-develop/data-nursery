import React, { useCallback, useState } from "react";
import styled from "styled-components";

// import domtoimage from 'dom-to-image';
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

  const qrImage = process.env.NEXT_PUBLIC_END_POINT + qrDownloadModalOpen?.data?.planter?.qrcode;

  // const [base64Image, setBase64Image] = useState(null);

  const qrCodeDownloadClick = useCallback(() => {
    // #1 (미리보기)
    // 이미지파일이 열림
    let url = qrImage;
    saveAs(url, qrDownloadModalOpen?.data?.planter?.serial_number + "-qrcode");

    /////////////////////////////////

    // #base64 변환1

    // URL 형식의 이미지
    // const imageUrl = `process.env.NEXT_PUBLIC_END_POINT + qrDownloadModalOpen?.data?.planter?.qrcode`;

    // // 변환 안되는 오류
    // // XMLHttpRequest를 사용하여 이미지 가져오기
    // const xhr = new XMLHttpRequest();
    // xhr.open("GET", imageUrl, true);
    // xhr.responseType = "blob";

    // xhr.onload = function () {
    //   if (xhr.status === 200) {
    //     // Blob을 가져왔습니다.
    //     const blob = xhr.response;

    //     // Blob을 Base64로 변환하기
    //     const reader = new FileReader();
    //     reader.onloadend = function () {
    //       const base64Data = reader.result;
    //       // 여기서 base64Data를 사용하거나 저장할 수 있습니다.
    //       setBase64Image(base64Data);
    //     };
    //     reader.readAsDataURL(blob);

    //   }
    // };
    // xhr.send();

    ////////////////////////////

    // // base64형식으로 하면 다운로드됨
    // const filename = "qrcode.png";

    // const link = document.createElement("a");
    // link.href = base64Image; // base64형식으로
    // link.download = filename;
    // link.click();
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
              <input value={qrDownloadModalOpen.data.name} disabled />
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
