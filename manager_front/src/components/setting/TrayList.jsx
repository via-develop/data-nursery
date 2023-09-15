import React, { useCallback, useState } from "react";
import styled from "styled-components";

import useTrayList from "@src/hooks/queries/planter/useTrayList";
import useDeleteMultipleTray from "@src/hooks/queries/planter/useDeleteMultipleTray";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import AddTrayModal from "./AddTrayModal";
import OptionModal from "./TrayOptionModal";
import EditTrayModal from "./EditTrayModal";
import TrayDeleteModal from "./TrayDeleteModal";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import TrayIcon from "@images/setting/tray-no-data.svg";
import DeleteIcon from "@images/setting/icon-delete.svg";
import { trayListKey } from "@src/utils/query-keys/PlanterQueryKeys";

const S = {
  Wrap: styled.div`
    width: 70%;

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
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 36px 0px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.recOutline};
  `,
  Title: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    .title {
      color: ${({ theme }) => theme.basic.deepBlue};
      ${({ theme }) => theme.textStyle.h4Bold}
    }
    .sub-title {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h6Reguler};
    }
  `,
  AddButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 172px;
    border: 1px solid ${({ theme }) => theme.primery.primery};

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.btnAction};
    }
  `,
  ContentList: styled.div`
    .table-header {
      padding: 6px 32px 6px 24px;
      margin-top: 16px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
        display: flex;
        justify-content: center;
        align-items: center;
      }

      svg {
        cursor: pointer;
      }

      .btn-wrap {
        width: 100%;
      }
    }

    .table-header-fir {
      width: 136px;
    }
    .table-header-sec {
      width: 109px;
    }
    .table-header-thir {
      width: 169px;
    }
    .table-header-four {
      width: 78px;
    }
    .table-header-five {
      width: 104px;
    }

    .check-img {
      width: 24px;
      height: 24px;
    }
  `,
  ListBlockWrap: styled.div`
    height: 368px;
    overflow-y: auto;
    padding-right: 24px;

    .selected {
      border: 1px solid ${({ theme }) => theme.primery.primery};
    }
    p {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .list-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .option-modal-wrap {
      position: relative;
    }

    .table-text-fir {
      width: 120px;
    }
    .table-text-sec {
      width: 120px;
    }
    .table-text-thir {
      width: 120px;
    }
    .table-text-four {
      width: 120px;
    }
    .table-text-fiv {
      width: 43px;
    }
  `,
  ListBlock: styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;
    height: 64px;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    svg {
      cursor: pointer;
    }

    .option-dot {
      cursor: pointer;
    }

    .icon-wrap {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: center;
    }
  `,
  EmptyData: styled.div`
    height: 420px;
    margin-top: 168px;
    gap: 14px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h5Reguler}
    }
  `,
  SelectDeleteBtn: styled.div`
    border-radius: 8px;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.primery.primery};
    display: flex;
    gap: 6px;
    height: 32px;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin-left: 16px;

    p {
      color: ${({ theme }) => theme.blackWhite.white} !important;
      ${({ theme }) => theme.textStyle.h7Bold};
    }
  `,
};

function TrayList({ userInfo }) {
  const invalidateQueries = useInvalidateQueries();

  // 옵션 모달
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  //트레이 추가 모달 오픈
  const [addTrayModalOpen, setAddTrayModalOpen] = useState(false);

  //트레이 수정 모달 오픈
  const [editTrayModalOpen, setEditTrayModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //트레이 삭제 모달 오픈
  const [deleteTrayModalOpen, setDeleteTrayModalOpen] = useState({
    open: false,
    deleteId: undefined,
  });

  const [checkArray, setCheckArray] = useState([]);

  // 트레이 목록 API
  const { data: trayList } = useTrayList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 트레이 다중 삭제 API
  const { mutate: deleteMultipleTrayMutate } = useDeleteMultipleTray(
    () => {
      // 트레이목록 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([trayListKey]);
      setCheckArray([]);
    },
    (error) => {
      alert(error);
    },
  );

  // 트레이 목록 : 눌렀을때 나오는 모달
  const handleCropsOptionModalClick = useCallback(
    (index, data) => {
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 체크박스 전제 선택 및 전체 해제
  const toggleAll = useCallback(
    (isAllCheck) => {
      if (isAllCheck) {
        // 전부 체크되어 있는 경우
        setCheckArray([]);
      } else {
        // 전부 체크 안되어 있는 경우
        const allCheckArray = [];

        trayList?.planter_trays.map((tray) => {
          allCheckArray.push(tray.id);
        });
        setCheckArray(allCheckArray);
      }
    },
    [trayList],
  );

  const toggleItem = useCallback(
    (isCheck, id) => {
      if (isCheck) {
        // 체크된 항목 클릭 시
        setCheckArray(checkArray.filter((checkId) => checkId !== id));
      } else {
        // 미체크된 항목 클릭 시
        setCheckArray((prev) => [...prev, id]);
      }
    },
    [checkArray],
  );

  return (
    <S.Wrap>
      <S.TitleWrap>
        <S.Title>
          <p className="title">트레이목록</p>
          <p className="sub-title">트레이목록 추가, 변경</p>
        </S.Title>
        {userInfo?.admin_user_info?.is_top_admin === true && (
          <S.AddButton
            onClick={() => {
              setAddTrayModalOpen(true);
            }}>
            <AddIcon width={24} height={24} />
            <p>트레이 추가</p>
          </S.AddButton>
        )}
      </S.TitleWrap>
      <S.ContentList>
        {trayList?.planter_trays.length === 0 ? (
          <S.EmptyData>
            <TrayIcon width={56} height={56} />
            <p>등록된 트레이가 없습니다.</p>
          </S.EmptyData>
        ) : (
          <>
            <div className="table-header">
              <div>
                {checkArray.length !== 0 && checkArray.length === trayList?.planter_trays.length ? (
                  <div className="check-img">
                    {userInfo?.admin_user_info?.is_top_admin === true && (
                      <CheckBoxOn
                        width={24}
                        height={24}
                        onClick={() => {
                          toggleAll(true);
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="check-img">
                    {userInfo?.admin_user_info?.is_top_admin === true && (
                      <CheckBoxOff
                        width={24}
                        height={24}
                        onClick={() => {
                          toggleAll(false);
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
              {checkArray.length === 0 ? (
                <>
                  <p className="table-header-fir">NO</p>
                  <p className="table-header-sec">트레이공수</p>
                  <p className="table-header-thir">가로</p>
                  <p className="table-header-four">세로</p>
                  <p className="table-header-five"></p>
                </>
              ) : (
                <>
                  <div className="btn-wrap">
                    <S.SelectDeleteBtn
                      onClick={() => {
                        deleteMultipleTrayMutate({
                          data: {
                            deleteTray: checkArray.join("||"),
                          },
                        });
                      }}>
                      <DeleteIcon width={12} height={12} />
                      <p>선택삭제</p>
                    </S.SelectDeleteBtn>
                  </div>
                </>
              )}
            </div>
            <S.ListBlockWrap>
              <div className="list-inner">
                {trayList?.planter_trays.map((tray, index) => {
                  return (
                    <S.ListBlock
                      key={`tray${tray.id}`}
                      className={`table-row ${checkArray.includes(tray.id) ? "selected" : ""}`}>
                      {checkArray.includes(tray.id) ? (
                        <div className="check-img">
                          {userInfo?.admin_user_info?.is_top_admin === true && (
                            <CheckBoxOn width={24} height={24} onClick={() => toggleItem(true, tray.id)} />
                          )}
                        </div>
                      ) : (
                        <div className="check-img">
                          {userInfo?.admin_user_info?.is_top_admin === true && (
                            <CheckBoxOff width={24} height={24} onClick={() => toggleItem(false, tray.id)} />
                          )}
                        </div>
                      )}
                      <p className="table-text-fir">{index + 1}</p>
                      <div className="table-text-sec icon-wrap">
                        <TrayIcon width={24} height={24} />
                        <p>{tray.total}</p>
                      </div>
                      <p className="table-text-thir">{tray.width}</p>
                      <p className="table-text-four">{tray.height}</p>
                      <div className="table-text-fiv option-modal-wrap">
                        {userInfo?.admin_user_info?.is_top_admin === true && (
                          <div
                            className="option-dot"
                            onClick={() => {
                              handleCropsOptionModalClick(index, tray);
                            }}>
                            <OptionDot width={32} height={32} />
                          </div>
                        )}

                        {index === optionModalOpen.index && (
                          <OptionModal
                            optionModalOpen={optionModalOpen}
                            setOptionModalOpen={setOptionModalOpen}
                            setEditTrayModalOpen={setEditTrayModalOpen}
                            setDeleteTrayModalOpen={setDeleteTrayModalOpen}
                          />
                        )}
                      </div>
                    </S.ListBlock>
                  );
                })}
              </div>
            </S.ListBlockWrap>
          </>
        )}
      </S.ContentList>

      {/* 트레이추가 모달 */}
      {addTrayModalOpen && (
        <div className="modal-wrap">
          <AddTrayModal setAddTrayModalOpen={setAddTrayModalOpen} />
        </div>
      )}

      {/* 트레이 수정 모달 */}
      {editTrayModalOpen.open && (
        <div className="modal-wrap">
          <EditTrayModal editTrayModalOpen={editTrayModalOpen} setEditTrayModalOpen={setEditTrayModalOpen} />
        </div>
      )}

      {/* 트레이 삭제 모달 */}
      {deleteTrayModalOpen.open && (
        <div className="modal-wrap">
          <TrayDeleteModal deleteId={deleteTrayModalOpen.deleteId} setDeleteTrayModalOpen={setDeleteTrayModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default TrayList;
