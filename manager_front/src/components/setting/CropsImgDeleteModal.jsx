import React, { useCallback } from "react";
import styled from "styled-components";

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
    min-height: 204px;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px 56px 32px 56px;
    display: flex;
    flex-direction: column;
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
    }

    .sub-title {
      color: ${({ theme }) => theme.basic.gray40};
      ${({ theme }) => theme.textStyle.h6Reguler};
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

function CropsImgDeleteModal({ setDeleteCropsImgModalOpen, setEditCropsImg }) {
  const closeModal = useCallback(() => {
    setDeleteCropsImgModalOpen({ open: false, data: undefined });
  }, []);

  const handleDeleteOkClick = useCallback(() => {
    setEditCropsImg(null);
    closeModal();
  }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <p className="title">작물 이미지를 삭제하시겠습니까?</p>
          <p className="sub-title">삭제된 작물이미지는 복원 할 수 없습니다.</p>
        </S.TitleWrap>
        <S.ButtonWrap>
          <div className="cancel-button" onClick={closeModal}>
            <p>취소</p>
          </div>
          <div className="ok-button" onClick={handleDeleteOkClick}>
            <p>확인</p>
          </div>
        </S.ButtonWrap>
      </S.WrapInner>
    </S.Wrap>
  );
}

export default CropsImgDeleteModal;
