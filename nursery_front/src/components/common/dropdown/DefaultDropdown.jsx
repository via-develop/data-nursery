import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useUpdateWork from "@hooks/queries/planter/useUpdateWork";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import DefaultModal from "@components/common/modal/DefaultModal";

import UpdateIcon from "@images/work/icon-update.svg";
import DeleteIcon from "@images/work/icon-delete.svg";
import { waitWorkListKey } from "@utils/query-keys/PlanterQueryKeys";

const S = {
  DropDownBackGroundWrap: styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    position: absolute;
    z-index: 99;
    top: 0px;
    left: 0px;
  `,
  DropdownWrap: styled.div`
    z-index: 101 !important;
    transform: translate3d(0%, 0%, 0);

    position: absolute;
    top: 56px;
    right: 24px;
    background: #ffffff;
    border-radius: 8px;
    padding: 8px;
    width: 120px;
    height: 120px;

    display: flex;
    flex-direction: column;
    gap: 8px;
  `,
  RowLayout: styled.div`
    width: 100%;
    height: 100%;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .drop-down-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .update-icon {
      stroke: ${({ theme }) => theme.basic.grey50};
    }

    .delete-icon {
      fill: ${({ theme }) => theme.basic.grey50};
    }

    &:hover {
      background-color: #5899fb;

      .drop-down-text {
        color: #ffffff;
      }

      .update-icon {
        stroke: #ffffff;
      }

      .delete-icon {
        fill: #ffffff;
      }
    }
  `,
};

function DefaultDropdown({ dropdownOpen, setDropdownOpen }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  const [modalOpen, setModalOpen] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
  });

  // 작업 수정 API
  const { mutate: updateWorkMutate } = useUpdateWork(
    () => {
      // 대기중인 작업 목록 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([waitWorkListKey]);
      router.push("/");
    },
    (error) => {
      alert(error);
    },
  );

  return (
    <>
      {dropdownOpen && (
        <S.DropDownBackGroundWrap
          onClick={() => {
            setDropdownOpen(false);
          }}>
          <S.DropdownWrap>
            <S.RowLayout>
              <UpdateIcon className="update-icon" />
              <p
                className="drop-down-text"
                onClick={() => {
                  router.push(`/work/${router.query.workId}/edit`);
                  setDropdownOpen(false);
                }}>
                수정
              </p>
            </S.RowLayout>
            <S.RowLayout>
              <DeleteIcon className="delete-icon" />
              <p
                className="drop-down-text"
                onClick={() => {
                  setDropdownOpen(false);
                  setModalOpen({
                    open: true,
                    type: "error",
                    title: "작업정보를 삭제하시겠습니까?",
                    description: "삭제된 장업정보는\n복원 할 수 없습니다.",
                    btnType: "two",
                    afterFn: () => {
                      updateWorkMutate({
                        data: {
                          workId: router.query.workId,
                          sowing_date: null,
                          deadline: null,
                          crop_id: null,
                          crop_kind: null,
                          planter_tray_id: null,
                          order_quantity: null,
                          seed_quantity: null,
                          is_del: true,
                        },
                      });
                    },
                  });
                }}>
                삭제
              </p>
            </S.RowLayout>
          </S.DropdownWrap>
        </S.DropDownBackGroundWrap>
      )}
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </>
  );
}

export default DefaultDropdown;
