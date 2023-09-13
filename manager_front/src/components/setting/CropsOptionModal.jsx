import React, { useCallback } from "react";
import styled from "styled-components";

import EditIcon from "@images/common/edit-icon.svg";
import DeleteIcon from "@images/common/delete-icon.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    justify-content: end;
    position: absolute;
    /* right: 30px; */
    /* left: 820px; */
    left: 117px;
    z-index: 1;

    .wrap-inner {
      align-items: center;
      position: absolute;
      /* top: 10px; */
      background-color: #fff;
      border-radius: 8px;
      padding: 8px;
      width: 111px;
      box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
    }
    .line {
      background-color: #fff;
      border-radius: 4px;
      padding: 8px 12px;
      align-items: center;
      justify-content: start;
      display: flex;
      gap: 10px;
      cursor: pointer;

      p {
        color: ${({ theme }) => theme.textStyle.gray50};
        ${({ theme }) => theme.textStyle.h7Reguler}
      }
      svg {
        fill: ${({ theme }) => theme.basic.darkBlue};
      }
    }
    .line:hover {
      background-color: ${({ theme }) => theme.primery.primery};

      p {
        color: #fff;
        ${({ theme }) => theme.textStyle.h7Reguler}
      }
      svg {
        fill: ${({ theme }) => theme.basic.whiteGray};
      }
    }

    .add-modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
    }
  `,
};

function CropsOptionModal({ optionModalOpen, setOptionModalOpen, setDeleteCropsModalOpen, setEditCropsModalOpen }) {
  // 수정
  const handelEditClick = useCallback(() => {
    setOptionModalOpen({ open: false, index: undefined, data: undefined });
    setEditCropsModalOpen({ open: true, data: optionModalOpen.data });
  }, []);

  //삭제
  const handleDeleteClick = useCallback(() => {
    setDeleteCropsModalOpen({ open: true, deleteId: optionModalOpen.data.id });
    setOptionModalOpen({ open: false, index: undefined, data: undefined });
  });

  return (
    <S.Wrap>
      <div className="wrap-inner">
        <div className="line" onClick={handelEditClick}>
          <div className="icon">
            <EditIcon width={16} height={16} />
          </div>
          <p>수정</p>
        </div>
        <div className="line" onClick={handleDeleteClick}>
          <div className="icon">
            <DeleteIcon width={16} height={16} />
          </div>
          <p>삭제</p>
        </div>
      </div>
    </S.Wrap>
  );
}

export default CropsOptionModal;
