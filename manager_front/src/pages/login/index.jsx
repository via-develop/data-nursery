import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { loginAPI } from "@apis/authAPIs";
import secureLocalStorage from "react-secure-storage";

import Logo from "@images/common/logo-data-nursery.svg";
import UserIcon from "@images/common/ico-user.svg";
import PwIcon from "@images/common/icon-key.svg";
import CheckOn from "@images/common/check-icon-on.svg";
import CheckOff from "@images/common/check-icon-off.svg";
import { loginCheckAuthentication } from "@src/utils/LoginCheckAuthentication";

const S = {
  Wrap: styled.div`
    min-height: 100vh;
    background-image: url("/images/common/background.svg");
    background-size: cover;
    background-repeat: no-repeat;
    justify-content: center;
    align-items: center;
    display: flex;
  `,
  ContentWrap: styled.div`
    display: flex;
    flex-direction: column;
  `,

  TitleWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .welcome {
      color: #405f8d;
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .logo-img {
      justify-content: center;
    }
    .title-info {
      color: #405f8d;
      font-size: 20px;
      font-weight: 400;
      line-height: 24px;
      margin-top: 16px;
      margin-bottom: 24px;
    }
  `,
  InputButtonWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  InputWrap: styled.div`
    border-radius: 8px;
    border: 1px solid #dcdcf0;
    background-color: #fff;
    padding: 20px 16px;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 10px;
    height: 60px;

    .input-style {
      border: 0px;
    }
    input::placeholder {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: -0.32px;
      color: #929fa6;
    }
    input:focus-visible {
      outline: none;
    }

    input {
      width: 100%;
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold};
    }
  `,
  IdSaveWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 11px;
    margin-top: 12px;

    p {
      color: #4f5b6c;
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: -0.32px;
    }

    .check-box {
      cursor: pointer;
    }
  `,
  LoginButton: styled.div`
    border-radius: 8px;
    padding: 16px 32px;
    justify-content: center;
    align-items: center;
    display: flex;
    height: 57px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    cursor: pointer;

    p {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
      color: #fff;
    }
  `,
};

function Login() {
  const router = useRouter();

  const [loginInfo, setLoginInfo] = useState({
    login_id: "",
    password: "",
    isStayLogin: false,
    l_type: "99",
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

  // 이메일 저장했는지 확인
  useEffect(() => {
    const saveId = secureLocalStorage.getItem("login_id");

    if (saveId) {
      setLoginInfo({
        login_id: saveId,
        password: "",
        isStayLogin: true,
        l_type: "99",
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

      router.push("/");
    } catch (e) {
      alert("로그인에 실패하였습니다. 아이디 및 비밀번호를 확인해주세요.");
    }
  }, [loginInfo]);

  // enter 키 입력 시 실행
  // const enterKeyUp = useCallback(() => {
  //   if (window.event.keyCode === 13) {
  //     if (loginInfo.login_id === "") {
  //       alert("아이디를 입력해주세요.");
  //       return;
  //     }

  //     if (loginInfo.password === "") {
  //       alert("비밀번호를 입력해주세요.");
  //       return;
  //     }

  //     tempLoginCheck();
  //   }
  // }, [loginInfo]);

  return (
    <S.Wrap>
      <S.ContentWrap>
        <S.TitleWrap>
          <p className="welcome">welcome</p>
          <div className="logo-img">
            <Logo height={49} />
          </div>
          <p className="title-info">대한민국 NO.1 자동파종기 관리 시스템</p>
        </S.TitleWrap>
        <S.InputButtonWrap>
          <S.InputWrap>
            <UserIcon width={20} height={20} />
            <input
              className="input-style"
              value={loginInfo.login_id}
              onChange={(e) => {
                handleInputChange("login_id", e.target.value);
              }}
              placeholder="아이디를 입력해주세요"
            />
          </S.InputWrap>
          <S.InputWrap>
            <PwIcon width={20} height={20} />
            <input
              className="input-style"
              type="password"
              value={loginInfo.password}
              maxLength={20}
              onChange={(e) => {
                handleInputChange("password", e.target.value);
              }}
              placeholder="비밀번호를 입력해주세요"
            />
          </S.InputWrap>
        </S.InputButtonWrap>
        <S.IdSaveWrap>
          <div className="check-box" onClick={stayLoginCheckBoxClick}>
            {loginInfo.isStayLogin ? <CheckOn width={24} height={24} /> : <CheckOff width={24} height={24} />}
          </div>
          <p>아이디 저장</p>
        </S.IdSaveWrap>
        <S.LoginButton onClick={tempLoginCheck}>
          <p>로그인</p>
        </S.LoginButton>
      </S.ContentWrap>
    </S.Wrap>
  );
}

// 로그인 되어있을 경우 메인페이지로 이동
export const getServerSideProps = loginCheckAuthentication((context) => {
  return { props: {} };
});

export default Login;
