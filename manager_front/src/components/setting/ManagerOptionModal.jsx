import React, { useCallback } from "react";
import styled from "styled-components";

import EditIcon from "@images/common/edit-icon.svg";
import DeleteIcon from "@images/common/delete-icon.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: end;
    position: absolute;
    right: 53px;
    background-color: #fff;
    border-radius: 8px;
    padding: 8px;
    width: 111px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

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

function ManagerOptionModal({
  optionModalOpen,
  setOptionModalOpen,
  setEditManagerModalOpen,
  setDeleteManagerModalOpen,
  boxTop,
  topData,
}) {
  // 관리자 수정
  const handelEditClick = useCallback(() => {
    setEditManagerModalOpen({ open: true, data: optionModalOpen.data });
    setOptionModalOpen({ open: false, index: undefined, data: undefined });
  }, []);

  //삭제
  const handleDeleteClick = useCallback(() => {
    setDeleteManagerModalOpen({ open: true, deleteId: optionModalOpen.data.user.id });
    setOptionModalOpen({ open: false, index: undefined, data: undefined });
  });

  return (
    <S.Wrap style={{ top: boxTop + topData - 10 }}>
      <div className="line" onClick={handelEditClick}>
        <div className="icon">
          <EditIcon width={16} height={16} />
        </div>
        <p>수정</p>
      </div>
      {optionModalOpen.data.admin_user_info.is_top_admin === false && (
        <div className="line" onClick={handleDeleteClick}>
          <div className="icon">
            <DeleteIcon width={16} height={16} />
          </div>
          <p>삭제</p>
        </div>
      )}
    </S.Wrap>
  );
}

export default ManagerOptionModal;
