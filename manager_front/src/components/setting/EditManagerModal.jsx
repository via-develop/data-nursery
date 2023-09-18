import React, { useCallback, useState } from "react";
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
    max-height: 100vh;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;
    display: flex;
    flex-direction: column;

    .input-btn-wrap {
      display: flex;
      gap: 16px;
    }
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
        color: ${({ theme }) => theme.basic.gray50};
        outline: none;
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
  PasswordChangeBtn: styled.div`
    cursor: pointer;
    height: 52px;
    width: 156px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    border: 1px solid #5899fb;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: #5899fb;
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.lightSky};
    }
  `,
};

function EditManagerModal({
  editManagerModalOpen,
  setEditManagerModalOpen,
  setEditManagerPWChangeModalOpen,
  setManagerList,
  setManagerListPage,
}) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);
  const [editManagerId, setEditManagerId] = useState(editManagerModalOpen.data.user.login_id);
  const [editManagerCompany, setEditManagerCompany] = useState(editManagerModalOpen.data.admin_user_info.company);
  const [editManagerDepartment, setEditManagerDepartment] = useState(
    editManagerModalOpen.data.admin_user_info.department,
  );
  const [editManagerPosition, setEditManagerPosition] = useState(editManagerModalOpen.data.admin_user_info.position);
  const [editManagerName, setEditManagerName] = useState(editManagerModalOpen.data.user.name);
  const [editManagerPhone, setEditManagerPhone] = useState(editManagerModalOpen.data.admin_user_info.phone);
  const closeModal = useCallback(() => {
    setEditManagerModalOpen({ open: false, data: undefined });
    setEditManagerCompany("");
    setEditManagerDepartment("");
    setEditManagerName("");
    setEditManagerPhone("");
    setEditManagerPosition("");
  }, []);

  const handleTraySaveClick = useCallback(() => {
    updateManagerList({
      data: {
        userId: editManagerModalOpen.data.user.id,
        user_data: {
          name: editManagerName,
          is_del: false,
        },
        admin_user_info_data: {
          company: editManagerCompany,
          department: editManagerDepartment,
          position: editManagerPosition,
          phone: editManagerPhone,
          is_del: false,
        },
      },
    });

    closeModal();
  }, [editManagerCompany, editManagerDepartment, editManagerPosition, editManagerName, editManagerPhone]);

  const handlePasswordChangeClick = useCallback(() => {
    setEditManagerPWChangeModalOpen({ open: true, data: editManagerModalOpen });
  });

  const { mutate: updateManagerList } = useUpdateManager(
    () => {
      closeModal();
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
      invalidateQueries([settingManagerListKey]);
      setManagerList([]);
      setManagerListPage(1);
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
            <p className="title">관리자 수정</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <S.TextWrap>
            <p className="input-title">아이디</p>
          </S.TextWrap>
          <div className="input-wrap-off">
            <input placeholder="사용하실 아이디를 입력하세요" value={editManagerId} />
          </div>

          <S.TextWrap>
            <p className="input-title">회사</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="회사명을 입력하세요"
              value={editManagerCompany}
              onChange={(e) => setEditManagerCompany(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">부서</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="부서명을 입력하세요"
              value={editManagerDepartment}
              onChange={(e) => setEditManagerDepartment(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">직책</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="직책을 입력하세요"
              value={editManagerPosition}
              onChange={(e) => setEditManagerPosition(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">담당자</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="이름을 입력하세요"
              value={editManagerName}
              onChange={(e) => setEditManagerName(e.target.value)}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">전화번호</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input
              placeholder="숫자만 입력하세요"
              value={editManagerPhone}
              onChange={(e) => setEditManagerPhone(e.target.value.replace(/[^0-9]/g, ""))}
            />
          </div>

          <S.TextWrap>
            <p className="input-title">비밀번호</p>
          </S.TextWrap>
          <div className="input-btn-wrap">
            <div className="input-wrap">
              <input value={"***********"} disabled />
              {/* <input value={editManagerModalOpen.data.password} type="password" disabled /> */}
            </div>
            <S.PasswordChangeBtn onClick={handlePasswordChangeClick}>
              <p>비밀번호 변경</p>
            </S.PasswordChangeBtn>
          </div>
        </S.InputWrap>

        {editManagerCompany.length === 0 ||
        editManagerDepartment.length === 0 ||
        editManagerPosition.length === 0 ||
        editManagerName.length === 0 ||
        editManagerPhone.length === 0 ? (
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

export default EditManagerModal;
