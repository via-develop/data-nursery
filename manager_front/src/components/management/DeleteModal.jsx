import React, { useCallback, useState, useRef } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
import useDeleteFarmhouse from "@src/hooks/queries/auth/useDeleteFarmhouse";
import { useFarmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

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

function AddFarmModal({ deleteModalOpen, setDeleteModalOpen, checkArray }) {
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);
  const invalidateQueries = useInvalidateQueries();

  console.log("checkArray", checkArray);
  console.log("deleteModalOpen", deleteModalOpen?.data?.data?.id);

  const closeModal = useCallback(() => {
    setDeleteModalOpen({ open: false, data: undefined });
  }, []);

  //체크한 선택삭제는 배열로 들어가고
  //개별삭제는 딕셔너리로 들어옴 data.id값으로 삭제

  const handleDeleteOkClick = useCallback(() => {
    // alert("확인 클릭");
    deleteFarmhouseMutate({
      data: {
        farmhouseId: deleteModalOpen.data.data.id,
      },
    });
  }, [deleteModalOpen]);

  console.log("deleteModalOpen", deleteModalOpen);

  const { mutate: deleteFarmhouseMutate } = useDeleteFarmhouse(
    () => {
      invalidateQueries([useFarmAllListKey]);
      closeModal();
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 삭제되었습니다.",
        okClick: null,
      });
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
          <p className="title">작물을 삭제하시겠습니까?</p>
          <p className="sub-title">삭제된 작물정보는 복원 할 수 없습니다.</p>
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

export default AddFarmModal;
