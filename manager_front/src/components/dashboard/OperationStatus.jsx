import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useInView } from "react-intersection-observer";

import { PlanterRealTimeKey } from "@src/utils/query-keys/PlanterQueryKeys";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import usePlanterRealTime from "@src/hooks/queries/planter/usePlanterRealTime";
import usePlanterRealTimeDateRange from "@src/hooks/queries/planter/usePlanterRealTimeDateRange";
import { YYYYMMDDDash } from "@src/utils/Formatting";

import { Tooltip } from "react-tooltip";
import { NumberCommaFormatting, CountPlusFormatting } from "@src/utils/Formatting";
import RealTimeDetailModal from "./RealTimeDetailModal";
import BarIcon from "@images/dashboard/icon-bar.svg";
import StatusOnIcon from "@images/dashboard/operation_status_on.svg";
import StatusOffIcon from "@images/dashboard/operation_status_off.svg";

const S = {
  Wrap: styled.div`
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    padding: 56px 56px 40px 56px;
    border-radius: 8px;
    background-color: #fff;
    height: 620px;
    width: 100%;
    gap: 28px;
    display: flex;
    flex-direction: column;

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
    justify-content: start;
    align-items: flex-end;
    gap: 16px;

    .title {
      font-size: 24px;
      font-weight: 700;
      line-height: 28px;
    }
    .status-date {
      color: #929fa6;
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
    }
  `,
  ContentWrap: styled.div`
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    overflow: auto;
    padding-right: 5px;

    &::-webkit-scrollbar {
      display: block !important;
      width: 8px !important;
      border-radius: 4px !important;
      background-color: ${({ theme }) => theme.basic.lightSky} !important;
      margin-left: 5px !important;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 4px !important;
      background-color: #bfcad9 !important;
    }

    .statusOff {
      border: 1px solid ${({ theme }) => theme.basic.whiteGray};
      background-color: ${({ theme }) => theme.basic.whiteGray};
    }
    .statusOn {
      border: 2px solid #fb97a3;
    }
  `,
  StatusBlock: styled.div`
    cursor: pointer;
    border-radius: 8px;
    padding: 20px 16px 20px 24px;
    width: fit-content;
    display: flex;
    gap: 16px;

    .block-text-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      /* cursor: default; */
    }
    .block-count-wrap {
      display: flex;
    }
    .block-title-on {
      color: #737f8f;
      ${({ theme }) => theme.textStyle.h5Bold};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 140px;
    }
    .block-title-off {
      color: ${({ theme }) => theme.basic.gray40};
      ${({ theme }) => theme.textStyle.h5Reguler};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 140px;
    }
    .block-count-wrap {
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 4px;
    }
    .block-count-on {
      color: ${({ theme }) => theme.basic.secondary};
      ${({ theme }) => theme.textStyle.h4Bold};
    }
    .block-count-off {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h4Bold};
    }
    .block-unit {
      color: #979797;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      letter-spacing: -0.32px;
    }
  `,
  StatusCountTooltip: styled(Tooltip)`
    border-radius: 8px !important;
    background-color: #4f5b6c !important;
    border: 1px solid #4f5b6c !important;
    padding: 12px 16px;

    .text-wrap {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    .tooltip-title {
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 16px;
      color: #c2d6e1;
    }

    .count-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .count {
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 28px;
      color: #fff;
    }

    .unit {
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 24px;
      color: #fff;
    }
  `,
};

function OperationStatus({ currentDate }) {
  const invalidateQueries = useInvalidateQueries();

  const [operationListPage, setOperationListPage] = useState(1);
  const [operationList, setOperationList] = useState([]);
  const [selectPlanterId, setSelectPlanterId] = useState("");
  // const [valueList,setValueList] = useState();

  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  // inView : 요소가 뷰포트에 진입했는지 여부
  const { ref, inView, entry } = useInView({
    threshold: 0, // 요소가 얼마나 노출되었을때 inView를 true로 변경할지 (0~1 사이의 값)
  });

  const { data: planterOperationStatus } = usePlanterRealTime({
    page: operationListPage,
    size: 20,
    successFn: (res) => {
      const resultList = operationList.concat(res.planter);
      // setOperationList((prev) => [...prev, ...res.planter]);
      const valueList = [...new Set(resultList)];
      setOperationList(valueList);
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  const handelRealTimeDetailClick = useCallback(
    (data) => {
      setRealTimeModalOpen({ open: true, data: data });
      setSelectPlanterId(data.planter);
    },
    [selectPlanterId],
  );

  const { data: planterDateRange } = usePlanterRealTimeDateRange({
    planterId: selectPlanterId,
    dateRange: YYYYMMDDDash(dateRange.startDate) + "||" + YYYYMMDDDash(dateRange.endDate),
    successFn: (res) => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  useEffect(() => {
    if (!planterOperationStatus) {
      return;
    }

    const intervalId = setInterval(() => {
      invalidateQueries([PlanterRealTimeKey]);
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(intervalId);
  }, [planterOperationStatus, PlanterRealTimeKey]);

  useEffect(() => {
    if (inView) {
      pageChange();
    }
  }, [inView]);

  // 페이지 변경
  const pageChange = useCallback(() => {
    if (operationList.length !== 0 && planterOperationStatus?.total > operationList.length) {
      setOperationListPage(operationListPage + 1);
    }
  }, [planterOperationStatus, operationListPage, operationList]);

  //실시간가동현황 모달 오픈
  const [realTimeModalOpen, setRealTimeModalOpen] = useState({
    open: false,
    data: undefined,
  });

  return (
    operationList && (
      <S.Wrap>
        <S.TitleWrap>
          <BarIcon width={5} height={28} />
          <p className="title">실시간 가동현황</p>
          <p className="status-date">{currentDate}</p>
        </S.TitleWrap>
        <S.ContentWrap>
          {operationList.map((data, index) => {
            return (
              <>
                <S.StatusBlock
                  key={`map${index}`}
                  className={data?.planter_status === "ON" ? "statusOn" : "statusOff"}
                  onClick={() => handelRealTimeDetailClick(data)}>
                  {data?.planter_status === "ON" ? (
                    <StatusOnIcon width={68} height={68} />
                  ) : (
                    <StatusOffIcon width={68} height={68} />
                  )}
                  <div className="block-text-wrap">
                    <p className={data?.planter_status === "ON" ? "block-title-on" : "block-title-off"}>
                      {" "}
                      {data?.farm_house_name}
                    </p>
                    <div className="block-count-wrap">
                      <p
                        id={`status-num${index}`}
                        className={data?.planter_status === "ON" ? "block-count-on" : "block-count-off"}>
                        {CountPlusFormatting(data?.planter_output)}
                      </p>
                      <p className="block-unit">개</p>
                    </div>
                  </div>
                  <S.StatusCountTooltip
                    anchorId={`status-num${index}`}
                    place="bottom"
                    content={
                      <div className="text-wrap">
                        <p className="tooltip-title">{data?.farm_house_name}</p>
                        <div className="count-wrap">
                          <p className="count">{NumberCommaFormatting(data?.planter_output)}</p>
                          <p className="unit">개</p>
                        </div>
                      </div>
                    }
                  />
                </S.StatusBlock>
              </>
            );
          })}
          <div ref={ref} />
        </S.ContentWrap>
        {realTimeModalOpen.open && (
          <div className="modal-wrap">
            <RealTimeDetailModal
              realTimeModalOpen={realTimeModalOpen}
              setRealTimeModalOpen={setRealTimeModalOpen}
              planterDateRange={planterDateRange}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </div>
        )}
      </S.Wrap>
    )
  );
}

export default OperationStatus;
