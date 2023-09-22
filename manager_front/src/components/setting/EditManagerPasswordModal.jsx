import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
import useUpdateManager from "@src/hooks/queries/auth/useUpdateManager";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { settingManagerListKey } from "@src/utils/query-keys/AuthQueryKeys";

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
    .password-false {
      color: ${({ theme }) => theme.basic.warning};
      ${({ theme }) => theme.textStyle.h7Reguler}
    }
    .password-true {
      color: ${({ theme }) => theme.basic.positive};
      ${({ theme }) => theme.textStyle.h7Reguler}
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
    border: 1px solid ${({ theme }) => theme.primery.primery};
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

function EditManagerPasswordModal({
  editManagerModalOpen,
  setEditManagerPWChangeModalOpen,
  setManagerList,
  setManagerListPage,
}) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  const [managerPassword, setManagerPassword] = useState("");

  // //기존 비밀번호
  // const [originPw, setOriginPw] = useState(editManagerModalOpen.data.password);
  //현재 입력하는 비밀번호
  const [inputPw, setInputPw] = useState("");
  //새 비밀번호
  const [newPw, setNewPw] = useState("");
  //새 비밀번호 확인
  const [newPwCheck, setNewPwCheck] = useState("");

  //기준비밀번호와 입력비밀번호가 동일한지 체크
  // const [originInputPwCheck, setOriginInputPwCheck] = useState(false);

  //새 비밀번호와 확인비밀번호가 동일한지 체크
  const [newPwSameCheck, setNewPwSameCheck] = useState(false);

  const closeModal = useCallback(() => {
    setEditManagerPWChangeModalOpen({ open: false, data: undefined });
    setInputPw("");
    setNewPw("");
    setNewPwCheck("");
  }, []);

  const handleSaveClick = useCallback(() => {
    // setManagerPassword(newPw);
    // closeModal();
    updateManagerPassword({
      data: {
        userId: editManagerModalOpen.data.user.id,
        user_data: {
          password: newPw,
          name: null,
          is_del: false,
        },
        admin_user_info_data: {
          company: null,
          department: null,
          position: null,
          phone: null,
          is_del: false,
        },
      },
    });
  }, [newPw]);

  //기존 비밀번호와 입력 비밀번호 동일한지 체크
  // useEffect(() => {
  //   if (originPw === inputPw) {
  //     setOriginInputPwCheck(true);
  //   } else {
  //     setOriginInputPwCheck(false);
  //   }
  // }, [originPw, inputPw]);

  //새 비밀번호와 확인이 동일한지 체크
  useEffect(() => {
    if (newPw === newPwCheck) {
      setNewPwSameCheck(true);
    } else {
      setNewPwSameCheck(false);
    }
  }, [newPw, newPwCheck]);

  const { mutate: updateManagerPassword } = useUpdateManager(
    () => {
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
      invalidateQueries([settingManagerListKey]);
      setManagerList([]);
      setManagerListPage(1);
      closeModal();
    },
    (error) => {
      setIsDefaultAlertShowState({
        isShow: true,
        type: "error",
        text: "오류가 발생했습니다.",
        okClick: null,
      });
    },
  );

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="title">비밀번호 변경</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          {/* <S.TextWrap>
            <p className="input-title">현재비밀번호</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="현재 비밀번호를 입력해주세요"
              value={inputPw}
              type="password"
              onChange={(e) => setInputPw(e.target.value)}
            />
          </div>
          {originInputPwCheck === false ? (
            <>
              <p className="password-false">* 현재 비밀번호와 일치하지 않습니다.</p>
            </>
          ) : (
            <>
              <p className="password-true">* 현재 비밀번호와 일치합니다.</p>
            </>
          )} */}

          <S.TextWrap>
            <p className="input-title">새 비밀번호</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="새 비밀번호를 입력해주세요"
              value={newPw}
              type="password"
              onChange={(e) => setNewPw(e.target.value)}
            />
          </div>
          <S.TextWrap>
            <p className="input-title">새 비밀번호 확인</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="새 비밀번호를 입력해주세요"
              value={newPwCheck}
              type="password"
              onChange={(e) => setNewPwCheck(e.target.value)}
            />
          </div>
          {newPw.length === 0 ? (
            <></>
          ) : (
            <>
              {newPwSameCheck === false ? (
                <>
                  <p className="password-false">* 새 비밀번호와 일치하지 않습니다.</p>
                </>
              ) : (
                <>
                  <p className="password-true">* 새 비밀번호와 일치합니다.</p>
                </>
              )}
            </>
          )}
        </S.InputWrap>

        {
          // originInputPwCheck === false ||
          // newPwSameCheck === false ||
          // inputPw.length === 0 ||
          newPw.length === 0 || newPwCheck.length === 0 ? (
            <S.ButtonWrapOff>
              <p>저장</p>
            </S.ButtonWrapOff>
          ) : (
            <S.ButtonWrap onClick={handleSaveClick}>
              <p>저장</p>
            </S.ButtonWrap>
          )
        }
      </S.WrapInner>
    </S.Wrap>
  );
}

export default EditManagerPasswordModal;
