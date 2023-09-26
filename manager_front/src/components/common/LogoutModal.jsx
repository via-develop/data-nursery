import React, { useCallback } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import userLogout from "@src/utils/userLogout";
import useAllCacheClear from "@src/hooks/queries/common/useAllCacheClear";

import WarningIcon from "@images/common/icon-warning.svg";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 365px;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px 56px 32px 56px;
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
  TitleWrap: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;

    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h5Bold};
      margin-top: 20px;
    }
  `,
  ButtonWrap: styled.div`
    margin-top: 32px;
    display: flex;
    gap: 16px;
    p {
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    .cancel-button {
      padding: 12px 24px;
      width: 118px;
      height: 40px;
      border: 1px solid ${({ theme }) => theme.primery.primery};
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;

      p {
        color: ${({ theme }) => theme.primery.primery};
      }
    }

    .ok-button {
      width: 118px;
      padding: 12px 40px;
      background-color: ${({ theme }) => theme.primery.primery};
      border: 1px solid ${({ theme }) => theme.primery.primery};
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      cursor: pointer;

      p {
        color: ${({ theme }) => theme.blackWhite.white};
      }
    }
  `,
};

function LogoutModal({ isLogOut, setIsLogOut }) {
  const router = useRouter();
  const clearQueries = useAllCacheClear();

  const closeModal = useCallback(() => {
    setIsLogOut(false);
  }, [isLogOut]);

  const handlelogOutOkClick = useCallback(() => {
    userLogout(router, clearQueries);
    closeModal();
  }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <WarningIcon width={64} height={64} />
        <S.TitleWrap>
          <p className="title">로그아웃을 진행하시겠습니까?</p>
        </S.TitleWrap>
        <S.ButtonWrap>
          <div className="cancel-button" onClick={closeModal}>
            <p>취소</p>
          </div>
          <div className="ok-button" onClick={handlelogOutOkClick}>
            <p>확인</p>
          </div>
        </S.ButtonWrap>
      </S.WrapInner>
    </S.Wrap>
  );
}

export default LogoutModal;
