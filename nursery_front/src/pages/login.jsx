import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { styled } from "styled-components";
import secureLocalStorage from "react-secure-storage";

import useAllCacheClear from "@src/hooks/queries/common/useAllCacheClear";
import { loginAPI } from "@apis/authAPIs";

import MainLayout from "@components/layout/MainLayout";
import PrefixInput from "@components/common/input/PrefixInput";
import DefaultButton from "@components/common/button/DefaultButton";

import OnCheckBoxIcon from "@images/login/on-check-box.svg";
import OffCheckBoxIcon from "@images/login/off-check-box.svg";
import { defaultButtonColor } from "@utils/ButtonColor";
import { loginCheckAuthentication } from "@utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 126px 24px 24px 24px;
    overflow-y: auto;
  `,
  LogoWrap: styled.div`
    display: flex;
    flex-direction: column;

    .welcome-text {
      ${({ theme }) => theme.textStyle.h3Bold};
      color: ${({ theme }) => theme.basic.darkBlue};
    }

    .data-nursery-text {
      font-family: Ubuntu;
      font-size: 34.307px;
      font-weight: 700;
      letter-spacing: -0.686px;
      color: #4b86dd;
    }

    .description-text {
      ${({ theme }) => theme.textStyle.h5Regular};
      color: ${({ theme }) => theme.basic.grey50};
      margin-top: 8px;
    }
  `,
  LoginInputWrap: styled.div`
    margin-top: 100px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  StayLoginWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 11px;
    margin: 12px 0px 32px 0px;
    width: fit-content;
    cursor: pointer;

    svg {
      cursor: pointer;
    }

    p {
      font-size: 18px;
      line-height: 20px;
      letter-spacing: -0.36px;
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
};

function LogInPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();

  const [loginInfo, setLoginInfo] = useState({
    login_id: "",
    password: "",
    isStayLogin: false,
    l_type: "01",
  });

  const handleInputChange = useCallback(
    (name, value) => {
      setLoginInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [loginInfo],
  );

  // 아이디 저장했는지 확인
  useEffect(() => {
    clearQueries();

    const saveId = secureLocalStorage.getItem("login_id");

    if (saveId) {
      setLoginInfo({
        login_id: saveId,
        password: "",
        isStayLogin: true,
      });
    }
  }, []);

  const stayLoginCheckBoxClick = useCallback(() => {
    handleInputChange("isStayLogin", !loginInfo.isStayLogin);
  }, [loginInfo.isStayLogin]);

  const tempLoginCheck = useCallback(async () => {
    try {
      const res = await loginAPI(loginInfo);

      // 아이디 저장 시 실행
      if (loginInfo.isStayLogin) {
        // 아이디 로컬스토리지에 저장
        secureLocalStorage.setItem("login_id", loginInfo.login_id);
      } else {
        // 아이디 로컬스토리지에서 삭제
        secureLocalStorage.removeItem("login_id");
      }

      if (res.data.planter.is_register) {
        router.push("/");
      } else {
        router.push("/QR-scanner");
      }
    } catch (e) {
      alert("로그인에 실패하였습니다. 아이디 및 비밀번호를 확인해주세요.");
    }
  }, [loginInfo]);

  // enter 키 입력 시 실행
  const enterKeyUp = useCallback(() => {
    if (window.event.keyCode === 13) {
      if (loginInfo.login_id === "") {
        alert("아이디를 입력해주세요.");
        return;
      }

      if (loginInfo.password === "") {
        alert("비밀번호를 입력해주세요.");
        return;
      }

      tempLoginCheck();
    }
  }, [loginInfo]);

  return (
    <MainLayout>
      <S.Wrap>
        <S.LogoWrap>
          <p className="welcome-text">welcome</p>
          <p className="data-nursery-text">Data Nursery</p>
          <p className="description-text">대한민국 NO.1 자동파종기 관리 시스템</p>
        </S.LogoWrap>
        <S.LoginInputWrap>
          <PrefixInput
            placeholder="아이디를 입력해주세요"
            text={loginInfo.login_id}
            setText={(e) => {
              handleInputChange("login_id", e.target.value);
            }}
            enterKeyUpFn={() => {
              enterKeyUp();
            }}
          />
          <PrefixInput
            placeholder="비밀번호를 입력해주세요"
            type="password"
            text={loginInfo.password}
            maxLength={20}
            setText={(e) => {
              handleInputChange("password", e.target.value);
            }}
            enterKeyUpFn={() => {
              enterKeyUp();
            }}
          />
        </S.LoginInputWrap>
        <S.StayLoginWrap onClick={stayLoginCheckBoxClick}>
          {loginInfo.isStayLogin ? <OnCheckBoxIcon /> : <OffCheckBoxIcon />}
          <p>아이디 저장</p>
        </S.StayLoginWrap>
        <DefaultButton text={"로그인"} onClick={tempLoginCheck} customStyle={defaultButtonColor} />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 되어있을 경우 메인페이지로 이동
export const getServerSideProps = loginCheckAuthentication((context) => {
  return { props: {} };
});

export default LogInPage;
