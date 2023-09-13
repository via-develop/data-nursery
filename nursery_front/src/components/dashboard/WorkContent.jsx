import { ImagePathCheck, NumberFormatting } from "@utils/Formatting";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import { useRouter } from "next/router";

import useUpdateWorkStatus from "@hooks/queries/planter/useWorkStatusUpdate";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import FontSmallDefaultButton from "@components/common/button/FontSmallDefaultButton";
import DefaultModal from "@components/common/modal/DefaultModal";

import { borderButtonColor } from "@utils/ButtonColor";
import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import theme from "@src/styles/theme";
import { dashBoardKey, statisticsKey, workHistoryKey, workingWorkInfoKey } from "@utils/query-keys/PlanterQueryKeys";
import DashboardArrowIcon from "@images/dashboard/dashboard-arrow-icon.svg";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteGrey};
    border: 1px solid ${({ theme }) => theme.basic.grey30};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin: 8px 0px 35px 0px;
    border-radius: 8px;
    padding: 24px 32px;
    display: flex;
    flex-direction: column;
    gap: 21px;
  `,
  CropKindWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.basic.recOutline};
    cursor: pointer;

    .crop-name {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
      ${({ theme }) => theme.textStyle.h3Bold}
    }
  `,
  WorkInfo: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 3px;
    gap: 16px;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
    }

    .text-wrap {
      width: calc(100% - 81px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h2BoldThin}
      flex:1;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey40};
      width: fit-content;
    }

    .seed-quantity-wrap {
      gap: 7px;
      align-items: center;
    }

    .seed-quantity-text {
      color: ${({ theme }) => theme.basic.grey50};
      flex: 1;
    }
  `,
  CropImage: styled.div`
    width: 65px;
    height: 65px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      props.isCropImage
        ? css`
            background-color: none;
          `
        : css`
            background-color: #ebebf5;
          `}
  `,
};

function WorkContent({ workingWorkInfo }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  const [workComplete, setWorkComplete] = useState(false); // 작업완료 클릭 여부

  const [modalOpen, setModalOpen] = useState({
    open: false,
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
    cancelFn: null,
  });

  // 작업 상태 변경 API
  const { mutate: updateWorkStatusMutate } = useUpdateWorkStatus(
    () => {
      // 작업중인 작업 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([workingWorkInfoKey]);

      if (workComplete) {
        // 오늘의 대시보드 정보 다시 불러오기 위해 쿼리키 삭제
        invalidateQueries([dashBoardKey]);
        // 작업이력 정보 다시 불러오기 위해 쿼리키 삭제
        invalidateQueries([workHistoryKey]);
        // 통계현황 정보 다시 불러오기 위해 쿼리키 삭제
        invalidateQueries([statisticsKey]);
        setWorkComplete(!workComplete);
      }
    },
    (error) => {
      alert(error);
    },
  );

  return !!workingWorkInfo ? (
    <S.Wrap>
      <S.CropKindWrap
        onClick={() => {
          router.push(`/work/${workingWorkInfo?.id}`);
        }}>
        <p className="crop-name">{workingWorkInfo?.crop_kind}</p>
        <DashboardArrowIcon />
      </S.CropKindWrap>
      <S.WorkInfo>
        <S.CropImage isCropImage={!!workingWorkInfo?.crop_img}>
          {!!workingWorkInfo?.crop_img ? (
            <Image src={ImagePathCheck(workingWorkInfo?.crop_img)} layout="fill" alt="crop image" />
          ) : (
            <NoneIcon width={25} height={25} fill={"#BCBCD9"} />
          )}
        </S.CropImage>
        <div className="text-wrap">
          <div className="count-text-wrap">
            <p className="count-text">{NumberFormatting(workingWorkInfo?.planter_work_output)}</p>
            <p className="suffix-text">개</p>
          </div>
          <div className="count-text-wrap seed-quantity-wrap">
            <BoxIcon />
            <p className="suffix-text seed-quantity-text">{NumberFormatting(workingWorkInfo?.tray_total)}공</p>
          </div>
        </div>
      </S.WorkInfo>
      <FontSmallDefaultButton
        text={"작업완료"}
        onClick={() => {
          setWorkComplete(true);
          setModalOpen({
            open: true,
            type: "success",
            title: "작업완료",
            description: "완료된 작업은 이력조회에서\n확인 할 수 있습니다.",
            btnType: "one",
            afterFn: () => {
              updateWorkStatusMutate({
                data: {
                  planter_work_id: workingWorkInfo?.id,
                  status: "DONE",
                },
              });
            },
            cancelFn: null,
          });
        }}
        customStyle={borderButtonColor}
      />
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </S.Wrap>
  ) : (
    <div className="no-work">
      <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
      <p>진행중인 작업이 없습니다</p>
    </div>
  );
}

export default WorkContent;
