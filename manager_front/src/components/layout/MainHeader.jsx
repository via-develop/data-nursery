import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";

import useUserInfo from "@src/hooks/queries/auth/useUserInfo";
import LogoutModal from "@components/common/LogoutModal";

import ProfileIcon from "../../../public/images/common/icon-profile.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    justify-content: space-between;

    .modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
    }
  `,
  DateWrap: styled.div`
    display: flex;
    align-items: center;
    p {
      color: ${({ theme }) => theme.basic.darkBlue};
      ${({ theme }) => theme.textStyle.h5Bold};
    }
  `,
  profileWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 17.5px;

    p {
      font-weight: 400;
      font-size: 16px;
      line-height: 20px;
      letter-spacing: -0.32px;
      color: #405f8d;
    }
  `,
  LogoutButton: styled.div`
    padding: 12px 24px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    cursor: pointer;

    p {
      font-size: 16px;
      ${({ theme }) => theme.textStyle.h6Bold};
    }
  `,
};

function MainHeader() {
  //로그아웃 모달
  const [isLogOut, setIsLogOut] = useState(false);

  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {},
  });

  // 날짜 + 시간
  const [currentTime, setCurrentTime] = useState("");

  // worker 불러오기
  useEffect(() => {
    const clockWorker = new Worker("worker.js");

    clockWorker.onmessage = (event) => {
      setCurrentTime(event.data);
    };
    return () => {
      clockWorker.terminate();
    };
  }, []);

  // 로그아웃 클릭
  const handleLogoutClick = useCallback(() => {
    setIsLogOut(true);
  }, [isLogOut]);

  return (
    <S.Wrap>
      <S.DateWrap>
        <p>{currentTime}</p>
      </S.DateWrap>
      <S.profileWrap>
        <ProfileIcon width={21} height={22} />
        <p>안녕하세요, {userInfo?.user?.name}님</p>
        <S.LogoutButton onClick={handleLogoutClick}>
          <p>로그아웃</p>
        </S.LogoutButton>
      </S.profileWrap>

      {isLogOut && (
        <div className="modal-wrap">
          <LogoutModal isLogOut={isLogOut} setIsLogOut={setIsLogOut} />
        </div>
      )}
    </S.Wrap>
  );
}

export default MainHeader;
