import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import useCreateManager from "@src/hooks/queries/auth/useCreateManager";
import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
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
    max-height: 100vh;
    overflow-y: auto;
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

    .input-wrap {
      width: 100%;
      background-color: ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      margin-bottom: 8px;

      input {
        background-color: ${({ theme }) => theme.basic.lightSky};
        border: 1px solid ${({ theme }) => theme.basic.lightSky};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Reguler};
        color: ${({ theme }) => theme.basic.gray60};
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray50};
        ${({ theme }) => theme.textStyle.h6Reguler}
      }
      input:focus-visible {
        outline: none;
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
};

function AddManagerModal({ setAddManagerModalOpen }) {
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);
  const invalidateQueries = useInvalidateQueries();

  //관리자 모달 정보
  const [managerId, setManagerId] = useState("");
  const [managerCompany, setManagerCompany] = useState("");
  const [managerDepartment, setManagerDepartment] = useState("");
  const [managerPosition, setManagerPosition] = useState("");
  const [managerName, setManagerName] = useState("");
  const [managerPhone, setManagerPhone] = useState("");
  const [managerPassword, setManagerPassword] = useState("");

  const closeModal = useCallback(() => {
    setAddManagerModalOpen(false);
    setManagerId("");
    setManagerCompany("");
    setManagerDepartment("");
    setManagerPosition("");
    setManagerName("");
    setManagerPhone("");
    setManagerPassword("");
  }, []);

  const handleTraySaveClick = useCallback(() => {
    createAdminMutate({
      data: {
        user_data: {
          login_id: managerId,
          password: managerPassword,
          name: managerName,
          code: "99",
        },
        admin_user_info_data: {
          company: managerCompany,
          department: managerDepartment,
          position: managerPosition,
          phone: managerPhone,
        },
      },
    });

    closeModal();
  }, [managerId, managerCompany, managerDepartment, managerPosition, managerName, managerPhone, managerPassword]);

  const { mutate: createAdminMutate } = useCreateManager(
    () => {
      closeModal();
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
      invalidateQueries([settingManagerListKey]);
    },
    (error) => {
      alert(error);
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
            <p className="title">관리자 추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <S.TextWrap>
            <p className="input-title">아이디</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="사용하실 아이디를 입력하세요"
              value={managerId}
              onChange={(e) => setManagerId(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">회사</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="회사명을 입력하세요"
              value={managerCompany}
              onChange={(e) => setManagerCompany(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">부서</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="부서명을 입력하세요"
              value={managerDepartment}
              onChange={(e) => setManagerDepartment(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">직책</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="직책을 입력하세요"
              value={managerPosition}
              onChange={(e) => setManagerPosition(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">담당자</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="이름을 입력하세요"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">전화번호</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="숫자만 입력하세요"
              value={managerPhone}
              onChange={(e) =>
                setManagerPhone(
                  e.target.value.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`),
                )
              }
              maxLength="13"
            />
          </div>

          <S.TextWrap>
            <p className="input-title">비밀번호</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="비밀번호를 입력하세요"
              value={managerPassword}
              type="password"
              onChange={(e) => setManagerPassword(e.target.value)}
            />
          </div>
        </S.InputWrap>

        {managerId.length === 0 ||
        managerCompany.length === 0 ||
        managerDepartment.length === 0 ||
        managerPosition.length === 0 ||
        managerName.length === 0 ||
        managerPhone.length === 0 ||
        managerPassword.length === 0 ? (
          <S.ButtonWrapOff>
            <p>저장</p>
          </S.ButtonWrapOff>
        ) : (
          <S.ButtonWrap onClick={handleTraySaveClick}>
            <p>저장</p>
          </S.ButtonWrap>
        )}
      </S.WrapInner>
    </S.Wrap>
  );
}

export default AddManagerModal;
