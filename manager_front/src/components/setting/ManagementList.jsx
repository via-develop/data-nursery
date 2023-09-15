import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";

import useManagerList from "@src/hooks/queries/auth/useManagerList";

import AddIcon from "@images/management/add-icon.svg";
import CheckBoxNone from "@images/setting/check-icon-none.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import TopManager from "@images/setting/top-manager.svg";
import CommonManager from "@images/setting/common-manager.svg";
import OptionModal from "./ManagerOptionModal";
import AddManagerModal from "./AddManagerModal";
import EditManagerModal from "./EditManagerModal";
import EditManagerPasswordModal from "./EditManagerPasswordModal";
import ManagerDeleteModal from "./ManagerDeleteModal";

import DeleteIcon from "@images/setting/icon-delete.svg";

const S = {
  Wrap: styled.div`
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
    padding: 24px 0px;
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
        ${({ theme }) => theme.textStyle.h7Reguler}
        display: flex;
        align-items: center;
        justify-content: center;
      }

      svg {
        cursor: pointer;
      }

      .btn-wrap {
        width: 100%;
      }
    }

    .header-table-first {
      width: 250px;
    }
    .header-table {
      width: 160px;
    }
    .header-table-fin {
      width: 100px;
    }
    .check-img {
      width: 24px;
      height: 24px;
    }
  `,
  ListBlockWrap: styled.div`
    max-height: 444px;
    overflow-y: auto;
    padding-right: 24px;

    .selected {
      border: 1px solid ${({ theme }) => theme.primery.primery};
    }

    .list-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .option-modal-wrap {
      position: relative;
    }
    .table-first {
      width: 155px;
      margin-left: 50px;
    }
    .table-text {
      width: 130px;
    }
    .table-thir {
      width: 50px;
    }
    .table-sec {
      width: 110px;
    }
    .check-img {
      width: 24px;
      height: 24px;
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
      display: flex;
      justify-content: center;
      align-items: center;
    }

    svg {
      cursor: pointer;
    }

    .option-dot {
      cursor: pointer;
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

function ManagementList({ userInfo }) {
  // inView : 요소가 뷰포트에 진입했는지 여부
  const { ref, inView, entry } = useInView({
    threshold: 0, // 요소가 얼마나 노출되었을때 inView를 true로 변경할지 (0~1 사이의 값)
  });

  const [checkArray, setCheckArray] = useState([]);

  const [managerList, setManagerList] = useState([]);
  const [managerListPage, setManagerListPage] = useState(1);

  const { data: managerListInfo } = useManagerList({
    page: managerListPage,
    size: 8,
    successFn: (res) => {
      setManagerList((prev) => [...prev, ...res.data]);
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });

  //관리자 추가 모달 오픈
  const [addManagerModalOpen, setAddManagerModalOpen] = useState(false);

  //관리자 수정 모달 오픈
  const [editManagerModalOpen, setEditManagerModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //관리자 비밀번호 변경 모달 오픈
  const [editManagerPwChangeModalOpen, setEditManagerPWChangeModalOpen] = useState({ open: false, data: undefined });

  //관리자 삭제모달 오픈
  const [deleteManagerModalOpen, setDeleteManagerModalOpen] = useState({
    open: false,
    deleteId: undefined,
  });

  useEffect(() => {
    if (inView) {
      pageChange();
    }
  }, [inView]);

  // 페이지 변경
  const pageChange = useCallback(() => {
    if (managerList.length !== 0 && managerListInfo?.total > managerList.length) {
      setManagerListPage(managerListPage + 1);
    }
  }, [managerListInfo, managerListPage, managerList]);

  //관리자 추가 모달
  const handelAddManagerModalClick = useCallback(() => {
    setAddManagerModalOpen(true);
  }, [addManagerModalOpen]);

  // : 눌렀을때 나오는 모달
  const handleOptionModalClick = useCallback(
    (index, data) => {
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 선택삭제 클릭
  const handelSelectDeleteClick = useCallback(() => {
    setDeleteManagerModalOpen({ open: true, deleteId: checkArray.join("||") });
  }, [checkArray]);

  // 체크박스 전제 선택 및 전체 해제
  const toggleAll = useCallback(
    (isAllCheck) => {
      if (isAllCheck) {
        // 전부 체크되어 있는 경우
        setCheckArray([]);
      } else {
        // 전부 체크 안되어 있는 경우
        const allCheckArray = [];

        // 개별 항목 중 'member_type'이 'top'이 아닌 항목만 업데이트
        managerList.map((manager) => {
          if (!manager.admin_user_info.is_top_admin) {
            allCheckArray.push(manager.user.id);
          }
        });

        setCheckArray(allCheckArray);
      }
    },
    [managerList],
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
          <p className="title">관리자목록</p>
          <p className="sub-title">관리자 추가 및 변경</p>
        </S.Title>
        {userInfo?.admin_user_info?.is_top_admin === true && (
          <S.AddButton onClick={handelAddManagerModalClick}>
            <AddIcon width={24} height={24} />
            <p>관리자 추가</p>
          </S.AddButton>
        )}
      </S.TitleWrap>
      <S.ContentList>
        <div className="table-header">
          <div>
            {checkArray.length !== 0 &&
            checkArray.length ===
              managerList.filter((manager) => manager.admin_user_info.is_top_admin === false).length ? (
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
              <p className="header-table-first">회원유형</p>
              <p className="header-table">계정아이디</p>
              <p className="header-table">회사명</p>
              <p className="header-table">부서명</p>
              <p className="header-table">직책</p>
              <p className="header-table">이름</p>
              <p className="header-table">연락처</p>
              <p className="header-table-fin"></p>
            </>
          ) : (
            <>
              <div className="btn-wrap">
                <S.SelectDeleteBtn onClick={handelSelectDeleteClick}>
                  <DeleteIcon width={12} height={12} />
                  <p>선택삭제</p>
                </S.SelectDeleteBtn>
              </div>
            </>
          )}
        </div>
        <S.ListBlockWrap>
          <div className="list-inner">
            {managerList.map((data, index) => {
              return (
                <S.ListBlock
                  key={data.user.id}
                  className={`table-row ${checkArray.includes(data.user.id) ? "selected" : ""}`}>
                  {data.admin_user_info.is_top_admin === true ? (
                    <div className="check-img">
                      {userInfo?.admin_user_info?.is_top_admin === true && (
                        <CheckBoxNone width={24} height={24} style={{ cursor: "auto" }} />
                      )}
                    </div>
                  ) : (
                    <>
                      {checkArray.includes(data.user.id) ? (
                        <div className="check-img">
                          {userInfo?.admin_user_info?.is_top_admin === true && (
                            <CheckBoxOn width={24} height={24} onClick={() => toggleItem(true, data.user.id)} />
                          )}
                        </div>
                      ) : (
                        <div className="check-img">
                          {userInfo?.admin_user_info?.is_top_admin === true && (
                            <CheckBoxOff width={24} height={24} onClick={() => toggleItem(false, data.user.id)} />
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {data.admin_user_info.is_top_admin === true ? (
                    <TopManager width={107} height={28} className="table-first" />
                  ) : (
                    <CommonManager width={107} height={28} className="table-first" />
                  )}
                  <p className="table-sec">{data.user.login_id}</p>
                  <p className="table-text">{data.admin_user_info.company}</p>
                  <p className="table-text">{data.admin_user_info.department}</p>
                  <p className="table-text">{data.admin_user_info.position}</p>
                  <p className="table-text">{data.user.name}</p>
                  <p className="table-text">{data.admin_user_info.phone}</p>
                  <div className="option-modal-wrap table-thir">
                    {userInfo?.admin_user_info?.is_top_admin === true && (
                      <div
                        className="option-dot"
                        onClick={() => {
                          handleOptionModalClick(index, data);
                        }}>
                        <OptionDot width={32} height={32} />
                      </div>
                    )}

                    {index === optionModalOpen.index && (
                      <OptionModal
                        optionModalOpen={optionModalOpen}
                        setOptionModalOpen={setOptionModalOpen}
                        setEditManagerModalOpen={setEditManagerModalOpen}
                        setDeleteManagerModalOpen={setDeleteManagerModalOpen}
                      />
                    )}
                  </div>
                </S.ListBlock>
              );
            })}
            <div ref={ref} />
          </div>
        </S.ListBlockWrap>
      </S.ContentList>

      {/* 관리자추가 모달 */}
      {addManagerModalOpen && (
        <div className="modal-wrap">
          <AddManagerModal setAddManagerModalOpen={setAddManagerModalOpen} />
        </div>
      )}

      {/* 관리자 수정 모달 */}
      {editManagerModalOpen.open && (
        <div className="modal-wrap">
          <EditManagerModal
            editManagerModalOpen={editManagerModalOpen}
            setEditManagerModalOpen={setEditManagerModalOpen}
            setEditManagerPWChangeModalOpen={setEditManagerPWChangeModalOpen}
          />
        </div>
      )}

      {/* 관리자 비밀번호 변경 모달 */}
      {editManagerPwChangeModalOpen.open && (
        <div className="modal-wrap">
          <EditManagerPasswordModal
            editManagerModalOpen={editManagerModalOpen}
            setEditManagerPWChangeModalOpen={setEditManagerPWChangeModalOpen}
          />
        </div>
      )}

      {/* 관리자 삭제모달 */}
      {deleteManagerModalOpen.open && (
        <div className="modal-wrap">
          <ManagerDeleteModal
            setManagerList={setManagerList}
            deleteManagerModalOpen={deleteManagerModalOpen}
            setDeleteManagerModalOpen={setDeleteManagerModalOpen}
          />
        </div>
      )}
    </S.Wrap>
  );
}

export default ManagementList;
