import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useRegisterPlanter from "@hooks/queries/planter/useRegisterPlanter";
import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";

import MainLayout from "@components/layout/MainLayout";
import DefaultButton from "@components/common/button/DefaultButton";
import DefaultModal from "@components/common/modal/DefaultModal";

import { defaultButtonColor } from "@utils/ButtonColor";
import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import userLogout from "@utils/userLogout";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 102px 24px 24px 24px;
    overflow-y: auto;

    .description-text {
      ${({ theme }) => theme.textStyle.h3Bold};
      color: ${({ theme }) => theme.basic.darkBlue};
      white-space: pre-line;
    }
  `,
  InputWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px !important;
    background-color: #fff;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.grey30};
    margin: 72px 0px;
  `,
  CustomInput: styled.input`
    width: 100%;
    flex: 1;
    ${({ theme }) => theme.textStyle.h5Bold}
    color: ${({ theme }) => theme.basic.grey60};
    outline: none;
    border: none;
    box-shadow: none !important;

    &:focus {
      border: none;
    }

    &::placeholder {
      color: #a5a5a5 !important;
    }
  `,
};

function PlanterRegistrationPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();

  const [serialNumber, setSerialNumber] = useState("");
  const [modalOpen, setModalOpen] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
  });

  const checkPlanterSerial = useCallback(() => {
    if (serialNumber === userInfo.planter.serial_number) {
      registerPlanterMutate({
        data: {
          serial_number: serialNumber,
        },
      });
    } else {
      setModalOpen({
        open: true,
        type: "error",
        title: "파종기 인식불가",
        description: "다시 시도해주세요.",
        btnType: "one",
        afterFn: null,
      });
    }
  }, [serialNumber]);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 파종기 등록 API
  const { mutate: registerPlanterMutate } = useRegisterPlanter(
    () => {
      setModalOpen({
        open: true,
        type: "success",
        title: "등록이 완료되었습니다.",
        description: "메인화면으로 이동합니다.",
        btnType: "one",
        afterFn: () => {
          router.push("/");
        },
      });
    },
    (error) => {
      alert(error);
    },
  );

  return (
    <MainLayout
      pageName={"파종기 등록"}
      backIconClickFn={() => {
        router.push(
          {
            pathname: "/QR-scanner",
            query: { step: "qrCode" },
          },
          "/QR-scanner",
        );
      }}>
      <S.Wrap>
        <p className="description-text">파종기 시리얼 번호를{"\n"}입력해주세요</p>
        <S.InputWrap>
          <S.CustomInput
            value={serialNumber}
            type={"text"}
            // maxLength={maxLength}
            placeholder={"예) KN001DS958"}
            onChange={(e) => {
              setSerialNumber(e.target.value);
            }}
          />
        </S.InputWrap>
        <DefaultButton
          text={"다음"}
          onClick={() => {
            checkPlanterSerial();
          }}
          customStyle={defaultButtonColor}
        />
      </S.Wrap>
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default PlanterRegistrationPage;
