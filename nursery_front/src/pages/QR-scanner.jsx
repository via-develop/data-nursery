import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { Html5Qrcode } from "html5-qrcode";
import { useRouter } from "next/router";
import axios from "axios";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useRegisterPlanter from "@hooks/queries/planter/useRegisterPlanter";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";
import { getUserInfoUrl } from "@apis/authAPIs";
import userLogout from "@utils/userLogout";

import MainLayout from "@components/layout/MainLayout";
import DefaultButton from "@components/common/button/DefaultButton";
import DefaultModal from "@components/common/modal/DefaultModal";
import FontSmallDefaultButton from "@components/common/button/FontSmallDefaultButton";

import QRCodeImage from "@images/login/img-qrcode.svg";
import { defaultButtonColor, greyButtonColor } from "@utils/ButtonColor";
import CloseIcon from "@images/common/close-icon.svg";
import { requireAuthentication } from "@utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 126px 24px 24px 24px;
    overflow-y: auto;

    .welcome-text {
      ${({ theme }) => theme.textStyle.h3Bold};
      color: ${({ theme }) => theme.basic.darkBlue};
    }

    .description-text {
      ${({ theme }) => theme.textStyle.h5Regular};
      color: ${({ theme }) => theme.basic.grey50};
      margin-top: 24px;
      white-space: pre-line;

      span {
        ${({ theme }) => theme.textStyle.h5Bold};
        color: #5899fb;
      }
    }
  `,
  QRCodeImageWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 24px 0px;
  `,
  QrScanWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    overflow-y: auto;
  `,
  ScanTopSection: styled.div`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 32px;
    padding: 16px 16px 32px;

    .close-icon-wrap {
      cursor: pointer;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      right: 0px;
      border-radius: 8px;
      background-color: ${({ theme }) => theme.basic.whiteAlpha20};
      margin-left: auto;
    }

    .please-scan-text {
      width: 254px;
      border-radius: 8px;
      padding: 16px;
      background-color: ${({ theme }) => theme.basic.whiteAlpha20};

      ${({ theme }) => theme.textStyle.h5Bold}
      color: #ffffff;
      text-align: center;
    }
  `,
  QrReaderWrap: styled.div`
    flex: 1;
    position: relative;

    #reader {
      width: 254px;
      height: 254px;
    }

    #qr-shaded-region {
      border-width: 4px !important;
      border-color: rgba(0, 0, 0, 0) !important;

      div {
        background-color: #5899fb !important;
      }
    }
  `,
  RegistrationButtonWrap: styled.div`
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding: 32px 16px 24px 16px;

    button {
      width: 138px;
      padding: 16px !important;
    }
  `,
};

function QRScannerPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();
  const [step, setStep] = useState("first");

  const [qrCodeScanner, setQRCodeScanner] = useState(null);

  const [modalOpen, setModalOpen] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
  });

  useEffect(() => {
    if (!!router.query.step) {
      setStep("qrCode");
    }
  }, [router.query]);

  useEffect(() => {
    if (step === "qrCode") {
      const scanner = new Html5Qrcode("reader");
      setQRCodeScanner(scanner);

      const config = {
        fps: 10,
        qrbox: { width: 243, height: 243 },
        rememberLastUsedCamera: true,
        disableFlip: true,
        aspectRatio: 1,
        facingMode: { exact: "environment" }, // 카메라 방향 (environment : 후면카메라, user : 전면카메라)
        focusMode: "continuous", // 포커스모드 (continuous : 지속 포커스)
        showTorchButtonIfSupported: true,
        useBarCodeDetectorIfSupported: true,
        showZoomSliderIfSupported: true,
        defaultZoomValueIfSupported: 2,
      };

      scanner.start(
        { facingMode: "environment" },
        config,
        (result) => {
          if (result === userInfo?.planter.serial_number) {
            // 시리얼번호 일치 시 성공모달 오픈 및 카메라 종료
            setModalOpen({
              open: true,
              type: "success",
              title: "QR코드가 정상적으로\n인식되었습니다.",
              description: "메인화면으로 이동합니다.",
              btnType: "one",
              afterFn: () => {
                registerPlanterMutate({
                  data: {
                    serial_number: result,
                  },
                });
              },
            });
            scanner.stop();
            scanner.clear();
          } else {
            setModalOpen({
              open: true,
              type: "error",
              title: "QR코드 인식불가",
              description: "다시 시도해주세요.",
              btnType: "one",
              afterFn: null,
            });
          }
        }, // success
        () => {}, // error
      );
    }
  }, [step]);

  // 카메라 종료
  const cameraClose = useCallback(() => {
    if (qrCodeScanner) {
      qrCodeScanner.stop();
      qrCodeScanner.clear();
    }
  }, [qrCodeScanner]);

  // 유저 정보 API
  const { data: userInfo, isLoading: userInfoLoading } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 파종기 등록 API
  const { mutate: registerPlanterMutate } = useRegisterPlanter(
    () => {
      router.push("/");
    },
    (error) => {
      alert(error);
    },
  );

  return (
    <>
      {step === "first" && (
        <MainLayout>
          <S.Wrap>
            <p className="welcome-text">환영합니다.</p>
            <p className="description-text">
              DataNursery님의{"\n"}생산량 관리를 시작해볼까요?{"\n"}
              {"\n"}먼저 <span>QR코드를 준비해주세요!</span>
            </p>
            <S.QRCodeImageWrap>
              <QRCodeImage />
            </S.QRCodeImageWrap>
            <DefaultButton
              text={"다음"}
              onClick={() => {
                setStep("qrCode");
              }}
              customStyle={defaultButtonColor}
            />
          </S.Wrap>
        </MainLayout>
      )}
      {step === "qrCode" && (
        <MainLayout isLoading={userInfoLoading} backgroundColor="#272727">
          <S.QrScanWrap>
            <S.ScanTopSection>
              <div
                className="close-icon-wrap"
                onClick={() => {
                  setStep("first");
                  cameraClose();
                }}>
                <CloseIcon fill={"#ffffff"} />
              </div>
              <div className="please-scan-text">QR코드를 인식해주세요.</div>
            </S.ScanTopSection>
            <S.QrReaderWrap>
              <div id="reader" />
            </S.QrReaderWrap>
            <S.RegistrationButtonWrap>
              <FontSmallDefaultButton
                text={"직접 등록"}
                onClick={() => {
                  router.push("planter-registration");
                  cameraClose();
                }}
                customStyle={greyButtonColor}
              />
            </S.RegistrationButtonWrap>
          </S.QrScanWrap>
          <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </MainLayout>
      )}
    </>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication(async (context) => {
  const userInfoRes = await axios.get(getUserInfoUrl(true), {
    headers: { Cookie: context.req.headers.cookie },
  });

  // 파종기 등록완료 상태에서 접근 시 dashboard 페이지로 이동
  if (userInfoRes.data.planter.is_register) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  } else {
    return { props: {} };
  }
});

export default QRScannerPage;
