import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import useUpdateWorkStatus from "@hooks/queries/planter/useWorkStatusUpdate";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import SuffixButton from "@components/common/button/SuffixButton";
import SmallButton from "@components/common/button/SmallButton";
import DefaultModal from "@components/common/modal/DefaultModal";

import { NumberFormatting } from "@utils/Formatting";
import { borderButtonColor, purpleButtonColor } from "@utils/ButtonColor";
import { waitWorkListKey, workingWorkInfoKey } from "@utils/query-keys/PlanterQueryKeys";
import NoneIcon from "@images/dashboard/none-icon.svg";
import ErrorIcon from "@images/common/alert-error.svg";
import theme from "@src/styles/theme";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 19px;

    .divider {
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.basic.grey20};
    }
  `,
  Content: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0px;
    cursor: pointer;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left;
    }

    .info-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 8px;
      width: calc(100% - 90px);
    }

    .crop-text {
      ${({ theme }) => theme.textStyle.h5Regular}
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h2BoldThin}
      flex: 1;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey50};
      width: fit-content;
    }

    .gap-eight {
      gap: 8px;
    }
  `,
  WorkingInfo: styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.basic.lightSky};
    margin: 8px 0px;

    .info-text {
      ${({ theme }) => theme.textStyle.h8Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
};

function WaitContent({ waitWorkList, isWorking, setSelectTab, intersectionRef }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

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
      // 대기중인 작업 목록 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([waitWorkListKey]);
      setSelectTab("working");
    },
    (error) => {
      alert(error);
    },
  );

  return waitWorkList?.total === 0 ? (
    <div className="no-work">
      <NoneIcon width={50} height={50} fill={theme.basic.grey20} />
      <p>대기중인 작업이 없습니다</p>
    </div>
  ) : (
    <S.Wrap>
      {isWorking && (
        <S.WorkingInfo>
          <ErrorIcon width={16} height={16} fill={theme.basic.grey50} />
          <p className="info-text">현재 진행중인 작업에 의해 수정만 가능합니다</p>
        </S.WorkingInfo>
      )}
      {waitWorkList.map((work, index) => {
        return (
          <>
            <S.Content
              key={`work${work.id}`}
              onClick={() => {
                router.push(`/work/${work.id}`);
              }}>
              <div className="info-wrap">
                <p className="crop-text">
                  {work.crop_name} #{work.crop_kine}
                </p>
                <div className="count-text-wrap gap-eight">
                  <div className="count-text-wrap">
                    <p className="count-text">{NumberFormatting(work.tray_total)}</p>
                    <p className="suffix-text">개</p>
                  </div>
                  <p className="suffix-text">{NumberFormatting(work.seed_quantity)}공</p>
                </div>
              </div>
              {isWorking ? (
                <SmallButton
                  width="84px"
                  text={"수정"}
                  onClick={(e) => {
                    router.push(`/work/${work.id}/edit`);
                    e.stopPropagation();
                  }}
                  customStyle={borderButtonColor}
                />
              ) : (
                <SuffixButton
                  text={"시작"}
                  onClick={(e) => {
                    setModalOpen({
                      open: true,
                      title: "작업시작",
                      description: "작업이 시작되면 정보수정은\n불가합니다. 진행할까요?",
                      btnType: "two",
                      afterFn: () => {
                        updateWorkStatusMutate({
                          data: {
                            planter_work_id: work.id,
                            status: "WORKING",
                          },
                        });
                      },
                      cancelFn: null,
                    });

                    e.stopPropagation();
                  }}
                  customStyle={purpleButtonColor}
                />
              )}
            </S.Content>
            {index !== waitWorkList.length - 1 && <div className="divider" />}
          </>
        );
      })}
      <div ref={intersectionRef} />
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </S.Wrap>
  );
}

export default WaitContent;
