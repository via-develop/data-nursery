import React, { useEffect, useState, useCallback } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { useRouter } from "next/router";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useWorkingWorkInfo from "@hooks/queries/planter/useWorkingWorkInfo";
import useWaitWorkList from "@hooks/queries/planter/useWaitWorkList";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";

import WorkContent from "@components/dashboard/WorkContent";
import WaitContent from "@components/dashboard/WaitContent";

import NoneIcon from "@images/dashboard/none-icon.svg";
import theme from "@src/styles/theme";
import { waitWorkListKey } from "@utils/query-keys/PlanterQueryKeys";
import userLogout from "@utils/userLogout";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;

    .no-work {
      margin-top: 48px;
    }
  `,
  TabWrap: styled.div`
    display: flex;
    align-items: stretch;
    gap: 8px;
  `,
  TabContent: styled.div`
    flex: 1;
    height: 63px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;

    .tab-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }

    img {
      margin-bottom: 8px;
    }

    .waiting-count-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .waiting-count-box {
      min-width: 56px;
      height: 32px;
      padding: 0px 8px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        ${({ theme }) => theme.textStyle.h5Bold}
        color: ${({ theme }) => theme.basic.grey50};
      }
    }

    .tab-bar {
      height: 4px;
      width: 100%;
      border-radius: 2px;
      background-color: ${({ theme }) => theme.basic.grey20};
      margin-top: 12px;
    }

    ${(props) =>
      props.isSelect &&
      css`
        .tab-text {
          ${({ theme }) => theme.textStyle.h5Bold}
        }

        .tab-bar {
          background-color: #5899fb;
        }
      `}
  `,
};

function WorkTab({ setLoading }) {
  const router = useRouter();
  const clearQueries = useAllCacheClear();
  const invalidateQueries = useInvalidateQueries();

  const [selectTab, setSelectTab] = useState("working");
  const [waitWorkListPage, setWaitWorkListPage] = useState(1);
  const [waitWorkList, setWaitWorkList] = useState([]);

  // inView : 요소가 뷰포트에 진입했는지 여부
  const { ref, inView, entry } = useInView({
    threshold: 0, // 요소가 얼마나 노출되었을때 inView를 true로 변경할지 (0~1 사이의 값)
  });

  useEffect(() => {
    if (inView) {
      pageChange();
    }
  }, [inView]);

  useEffect(() => {
    invalidateQueries([waitWorkListKey]);
  }, []);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 진행중인 주문 목록 API
  const { data: workingWorkInfo, isLoading: workingWorkInfoLoading } = useWorkingWorkInfo({
    serialNumber: userInfo?.planter.serial_number,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 대기중인 주문 목록 API
  const { data: waitWorkListData, isLoading: waitWorkListDataLoading } = useWaitWorkList({
    serialNumber: userInfo?.planter.serial_number,
    page: waitWorkListPage,
    successFn: (res) => {
      setWaitWorkList((prev) => [...prev, ...res.planter_works]);
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  useEffect(() => {
    if ((workingWorkInfoLoading || waitWorkListDataLoading) && !(!workingWorkInfo || !waitWorkListData)) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [workingWorkInfoLoading, waitWorkListDataLoading, workingWorkInfo, waitWorkListData]);

  // 페이지 변경
  const pageChange = useCallback(() => {
    if (waitWorkList.length !== 0 && waitWorkListData?.total > waitWorkList.length) {
      setWaitWorkListPage(waitWorkListPage + 1);
    }
  }, [waitWorkListData, waitWorkListPage, waitWorkList]);

  return !!workingWorkInfo || waitWorkListData?.total !== 0 ? (
    <S.Wrap>
      <S.TabWrap>
        <S.TabContent
          isSelect={selectTab === "working"}
          onClick={() => {
            setSelectTab("working");
          }}>
          {workingWorkInfo?.planter_status === "WORKING" && (
            <Image src={"/images/dashboard/working-ani.gif"} width={31} height={16} alt="working gif" />
          )}
          <p className="tab-text">작업중</p>
          <div className="tab-bar" />
        </S.TabContent>
        <S.TabContent
          isSelect={selectTab === "waiting"}
          onClick={() => {
            setSelectTab("waiting");
          }}>
          <div className="waiting-count-wrap">
            <p className="tab-text">대기중</p>
            <div className="waiting-count-box">
              <p>{waitWorkListData?.total}건</p>
            </div>
          </div>
          <div className="tab-bar" />
        </S.TabContent>
      </S.TabWrap>
      {selectTab === "working" && <WorkContent workingWorkInfo={workingWorkInfo} />}
      {selectTab === "waiting" && (
        <WaitContent
          waitWorkList={waitWorkList}
          isWorking={!!workingWorkInfo}
          setSelectTab={setSelectTab}
          intersectionRef={ref}
        />
      )}
    </S.Wrap>
  ) : (
    <div className="no-work">
      <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
      <p>새 작업을 등록하세요!</p>
    </div>
  );
}

export default WorkTab;
