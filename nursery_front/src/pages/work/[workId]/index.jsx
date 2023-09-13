import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useWorkingWorkInfo from "@hooks/queries/planter/useWorkingWorkInfo";
import useWorkInfo from "@hooks/queries/planter/useWorkInfo";
import useUpdateWorkStatus from "@hooks/queries/planter/useWorkStatusUpdate";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";

import MainLayout from "@components/layout/MainLayout";
import DefaultInput from "@components/common/input/DefaultInput";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import { defaultButtonColor } from "@utils/ButtonColor";
import { DateFormatting } from "@utils/Formatting";
import CheckIcon from "@images/work/icon-check.svg";
import { waitWorkListKey, workingWorkInfoKey } from "@utils/query-keys/PlanterQueryKeys";
import userLogout from "@utils/userLogout";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    overflow-y: auto;
    padding: 8px 24px 42px 24px;
  `,
  InputWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .category-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  WorkStatusWrap: styled.div`
    width: 100%;
    height: 72px;
    background-color: ${({ theme }) => theme.basic.whiteGrey};
    border-radius: 8px;
    padding: 6px 8px 6px 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;

    .status-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
};

function WorkInfoPage({ workId }) {
  const router = useRouter();
  const clearQueries = useAllCacheClear();
  const invalidateQueries = useInvalidateQueries();

  // BottomButton 정보
  const [buttonSetting, setButtonSetting] = useState({
    color: defaultButtonColor,
    text: "시작",
    onClickEvent: () => {
      updateWorkStatusMutate({
        data: {
          planter_work_id: workId,
          status: "WORKING",
        },
      });
    },
  });

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 진행중인 주문 목록 API
  const { data: workingWorkInfo } = useWorkingWorkInfo({
    serialNumber: userInfo?.planter.serial_number,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작업 정보 API
  const { data: workInfo } = useWorkInfo({
    workId: workId,
    successFn: (res) => {
      if (res.planter_work_status.status === "WAIT") {
        setButtonSetting({
          color: defaultButtonColor,
          text: "시작",
          onClickEvent: () => {
            updateWorkStatusMutate({
              data: {
                planter_work_id: workId,
                status: "WORKING",
              },
            });
          },
        });
      } else if (res.planter_work_status.status === "WORKING") {
        setButtonSetting({
          color: defaultButtonColor,
          text: "작업완료",
          onClickEvent: () => {
            updateWorkStatusMutate({
              data: {
                planter_work_id: workId,
                status: "DONE",
              },
            });
          },
        });
      }
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작업 상태 변경 API
  const { mutate: updateWorkStatusMutate } = useUpdateWorkStatus(
    () => {
      // 작업중인 작업 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([workingWorkInfoKey]);
      // 대기중인 작업 목록 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([waitWorkListKey]);
      router.push("/");
    },
    (error) => {
      alert(error);
    },
  );

  return (
    <MainLayout
      pageName={"작업 정보"}
      backIconClickFn={() => {
        router.push("/");
      }}
      isMoreIcon={workInfo?.planter_work_status.status === "WAIT"}
      // 대기중 및 작업중일 경우에만 버튼 노출
      buttonSetting={
        !!workInfo &&
        (workInfo?.planter_work_status.status === "DONE" ||
          (workInfo?.planter_work_status.status === "WAIT" && !!workingWorkInfo && workingWorkInfo?.id !== workId))
          ? null
          : buttonSetting
      }>
      <S.Wrap>
        <S.InputWrap>
          <p className="category-text">작업상태</p>
          <S.WorkStatusWrap>
            {workInfo?.planter_work_status.status === "WAIT" && <p className="status-text">대기중인 작업</p>}
            {workInfo?.planter_work_status.status === "WORKING" && (
              <>
                <Image src={"/images/dashboard/working-ani.gif"} width={31} height={16} alt="working gif" />
                <p className="status-text">진행중인 작업</p>
              </>
            )}
            {workInfo?.planter_work_status.status === "DONE" && (
              <>
                <CheckIcon />
                <p className="status-text">작업완료</p>
              </>
            )}
          </S.WorkStatusWrap>
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">출하일</p>
          <DefaultInput text={DateFormatting(workInfo?.planter_work.deadline)} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">작물</p>
          <DefaultInput text={workInfo?.crop.name} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">품종</p>
          <DefaultInput text={workInfo?.planter_work.crop_kind} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">트레이</p>
          <DefaultInput text={workInfo?.planter_tray.total + " 공"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">주문수량</p>
          <DefaultInput text={workInfo?.planter_work.order_quantity + " 장"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">파종량</p>
          <DefaultInput text={workInfo?.planter_work.seed_quantity + " 개"} readOnly={true} />
        </S.InputWrap>
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication(async (context) => {
  if (!context.query.workId) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  } else {
    return {
      props: {
        workId: context.query.workId,
      },
    };
  }
});

export default WorkInfoPage;
