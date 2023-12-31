import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";

import { NumberCommaFormatting } from "@src/utils/Formatting";
import GraphTodayProductionNoWork from "./GraphTodayProductionNoWork";
import GraphTodayProduction from "./GraphTodayProduction";
import { YYYYMMDDSlash } from "@src/utils/Formatting";

import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { PlanterRealTimeDateRangeKey } from "@src/utils/query-keys/PlanterQueryKeys";

import DatePickerMain from "@components/statistics/DatePickerMain";

import XIcon from "@images/common/icon-x.svg";
import StatusOnIcon from "@images/dashboard/operation_status_on.svg";
import StatusOffIcon from "@images/dashboard/operation_status_off.svg";
import BarIcon from "@images/dashboard/icon-bar.svg";
import PlantIcon from "@images/dashboard/plant-icon.svg";
import CropsNoIcon from "@images/setting/crops-no-img.svg";
import PickerIcon from "@images/statistics/date-picker-icon.svg";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 1500px;
    height: 1099px;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 16px 40px 32px;
    display: flex;
    flex-direction: column;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: flex-end;

    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }
    .x-icon {
      cursor: pointer;
    }
  `,
  TitleBlock: styled.div`
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border-radius: 8px;
    display: flex;
    padding: 20px 24px;
    align-items: center;
    justify-content: space-between;
    margin-right: 16px;
    margin-bottom: 48px;

    .left-inner {
      display: flex;
      align-items: center;
      gap: 16px;

      p {
        color: ${({ theme }) => theme.basic.deepBlue};
        ${({ theme }) => theme.textStyle.h4Bold};
      }
    }
    .right-inner {
      display: flex;
      gap: 8px;

      p {
        display: flex;
        align-items: center;
      }

      .detail-date {
        margin-right: 8px;
        color: ${({ theme }) => theme.basic.gray40};
        ${({ theme }) => theme.textStyle.h5Reguler};
      }

      .detail-count {
        color: ${({ theme }) => theme.basic.secondary};
        ${({ theme }) => theme.textStyle.h4Bold};
      }

      .detail-ing {
        color: ${({ theme }) => theme.basic.gray40};
        ${({ theme }) => theme.textStyle.h5Reguler};
      }
    }
  `,
  WorkDateWrap: styled.div`
    display: flex;
    gap: 24px;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h5Bold};
    }

    .title-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .title-circle {
      width: 7px;
      height: 7px;
      border-radius: 20px;
      background-color: ${({ theme }) => theme.basic.gray30};
    }
  `,
  BorderLine: styled.div`
    height: 1px;
    border: 2px solid ${({ theme }) => theme.basic.gray20};
    margin: 20px 16px 48px 0px;
  `,
  GraphWrap: styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-between;

    .graph-inner-left {
      width: 100%;
    }
    .graph-inner-right {
      width: 100%;
      margin-right: 16px;
    }
    .graph-title {
      display: flex;
      align-items: center;
      gap: 16px;

      p {
        color: ${({ theme }) => theme.basic.deepBlue};
        ${({ theme }) => theme.textStyle.h4Bold};
      }
    }
  `,
  Proceeding: styled.div`
    display: flex;
    flex-direction: column;
    gap: 17.5px;
    margin-top: 41.5px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold};
    }

    .create-ing {
      display: flex;
      padding: 24px;
      border-radius: 8px;
      border: 3px solid ${({ theme }) => theme.basic.secondary};
      justify-content: space-between;
      align-items: center;
    }

    .create-ing-product {
      display: flex;
      gap: 10px;
      align-items: center;

      .working-crop-img {
        width: 84px;
        height: 84px;
        border-radius: 84px;
      }
    }
    .create-ing-text {
      display: flex;
      flex-direction: column;
      padding: 8px;
      gap: 8px;
    }

    .create-time {
      background-color: ${({ theme }) => theme.basic.whiteGray};
      border-radius: 8px;
      height: 24px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      p {
        color: ${({ theme }) => theme.basic.gray50};
      }
    }

    .production-count {
      display: flex;
      gap: 5px;

      p {
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${({ theme }) => theme.basic.gray60};
      }

      .num {
        ${({ theme }) => theme.textStyle.h4Bold};
      }
      .unit {
        ${({ theme }) => theme.textStyle.h5Reguler};
      }
    }

    .work-none {
      display: flex;
      flex-direction: column;
      padding: 24px;
      gap: 24px;
      border-radius: 8px;
      border: 3px solid ${({ theme }) => theme.basic.gray20};
      justify-content: center;
      align-items: center;

      p {
        ${({ theme }) => theme.textStyle.h5Reguler};
        color: ${({ theme }) => theme.basic.gray50};
      }
    }
  `,
  Complete: styled.div`
    margin-top: 32px;

    .complete-title {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h6Bold};
    }

    .list-wrap {
      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h6Reguler};
      }

      .list-inner {
        margin-right: 15px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }

      .text-one {
        ${({ theme }) => theme.textStyle.h6Bold};
      }
      .text-two {
        ${({ theme }) => theme.textStyle.h7Bold};
      }
      .text-three {
        ${({ theme }) => theme.textStyle.h6Bold};
      }
    }
    .list-head {
      display: flex;
      justify-content: space-between;
      padding: 0px 46px 16px 40px;
    }
  `,
  ListBlockWrap: styled.div`
    max-height: 368px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;

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

    .work-none {
      margin-top: 31.58px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      justify-content: center;
      align-items: center;

      p {
        ${({ theme }) => theme.textStyle.h5Reguler};
        color: ${({ theme }) => theme.basic.gray50};
      }
    }
  `,
  ListBlock: styled.div`
    width: 100%;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: ${({ theme }) => theme.basic.gray50} !important;
    }
    .text-img-wrap {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .done-crop-img {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
  `,
  Line: styled.div`
    background-color: ${({ theme }) => theme.basic.recOutline};
    width: 1px;
    height: 100%;
    margin-left: 59px;
    margin-right: 59px;
  `,
  Line2: styled.div`
    height: 1px;
    width: 100%;
    background-color: ${({ theme }) => theme.basic.recOutline};
    margin: 16px 0px;
  `,
  ClickPicker: styled.div`
    padding: 6px 12px 6px 16px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    border-radius: 8px;
    background-color: ${({ theme }) => theme.blackWhite.white};
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 248px;
    height: 36px;
    cursor: pointer;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler}
    }
  `,
};

function RealTimeDetailModal({ realTimeModalOpen, setRealTimeModalOpen, planterDateRange, dateRange, setDateRange }) {
  const invalidateQueries = useInvalidateQueries();
  useEffect(() => {
    if (!planterDateRange) {
      return;
    }

    const intervalId = setInterval(() => {
      invalidateQueries([PlanterRealTimeDateRangeKey]);
    }, 30000); // 30초마다 업데이트

    return () => clearInterval(intervalId);
  }, [planterDateRange]);

  const closeModal = useCallback(() => {
    setRealTimeModalOpen({ open: false, data: undefined });
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
    });
  }, [realTimeModalOpen, dateRange]);

  const workingArr = planterDateRange?.filter((item) => item.last_pws_status === "WORKING");
  const doneArr = planterDateRange?.filter((item) => item.last_pws_status === "DONE");

  planterDateRange?.sort((a, b) => new Date(a.output_updated_at) - new Date(b.output_updated_at));
  workingArr?.sort((a, b) => new Date(a.output_updated_at) - new Date(b.output_updated_at));
  doneArr?.sort((a, b) => new Date(a.output_updated_at) - new Date(b.output_updated_at));

  // 진행중 시간 kst로 변환
  const kstWorkingArr = workingArr?.map((item) => {
    const originalDate = new Date(item.output_updated_at);

    // 9시간을 더함
    originalDate.setHours(originalDate.getHours() + 9);

    // 변경된 날짜를 ISO 문자열로 변환
    const updatedOutput = originalDate.toISOString();

    return { ...item, output_updated_at: updatedOutput };
  });

  // 완료시간 kst로 변환
  const kstDoneArr = doneArr?.map((item) => {
    const originalDate = new Date(item.output_updated_at);

    // 9시간을 더함
    originalDate.setHours(originalDate.getHours() + 9);

    // 변경된 날짜를 ISO 문자열로 변환
    const updatedOutput = originalDate.toISOString();

    return { ...item, output_updated_at: updatedOutput };
  });

  //달력 모달 오픈
  const [pickerOpen, setPickerOpen] = useState(false);

  //달력 클릭
  const handlePickerClick = useCallback(() => {
    setPickerOpen(true);
  }, [pickerOpen]);

  const [dateTime, setDateTime] = useState();

  useEffect(() => {
    // 웹 워커 생성
    const worker = new Worker("worker.js");

    // 웹 워커로부터 메시지를 수신하는 이벤트 핸들러
    worker.onmessage = (event) => {
      // setKoreanTime(event.data);
      const { date } = event.data;
      setDateTime(date);
    };
    // 컴포넌트 언마운트 시 웹 워커 정리
    return () => {
      worker.terminate();
      worker.postMessage("getKoreanTime");
    };
  }, [dateTime]);

  return (
    !!planterDateRange && (
      <S.Wrap>
        <S.WrapInner>
          <S.TitleWrap>
            <div className="x-icon" onClick={closeModal}>
              <XIcon width={24} height={24} />
            </div>
          </S.TitleWrap>
          <S.TitleBlock>
            <div className="left-inner">
              {realTimeModalOpen.data.planter_status === "ON" ? (
                <StatusOnIcon width={68} height={68} />
              ) : (
                <StatusOffIcon width={68} height={68} />
              )}
              <p>{realTimeModalOpen.data.farm_house_name}</p>
            </div>
            <div className="right-inner">
              <p className="detail-date">{dateTime}</p>
              <p className="detail-count">
                {NumberCommaFormatting(
                  realTimeModalOpen.data.planter_output === null ? 0 : realTimeModalOpen.data.planter_output,
                )}
                개
              </p>
              {realTimeModalOpen.data.planter_status === "ON" && <p className="detail-ing">진행중</p>}
            </div>
          </S.TitleBlock>
          <>
            <S.WorkDateWrap>
              <div className="title-wrap">
                <div class="title-circle" />
                <p>작업기간 선택</p>
              </div>
              <div className="date-wrap">
                <S.ClickPicker onClick={handlePickerClick}>
                  <p>
                    {YYYYMMDDSlash(dateRange.startDate)} ~ {YYYYMMDDSlash(dateRange.endDate)}
                  </p>
                  <PickerIcon width={19} height={19} />
                </S.ClickPicker>
              </div>
            </S.WorkDateWrap>
            <S.BorderLine />
          </>

          <S.GraphWrap>
            <div className="graph-inner-left">
              <div className="graph-title">
                <BarIcon width={5} height={28} />
                <p>생산량</p>
              </div>
              {realTimeModalOpen.data.planter_status === "ON" ? (
                <>
                  <GraphTodayProduction planterDateRange={planterDateRange} />
                </>
              ) : (
                <>
                  <GraphTodayProductionNoWork />
                </>
              )}
            </div>
            <S.Line />
            <div className="graph-inner-right">
              <div className="graph-title">
                <BarIcon width={5} height={28} />
                <p>생산목록</p>
              </div>
              <S.Proceeding>
                <p>진행중</p>
                {kstWorkingArr?.length !== 0 ? (
                  <div className="create-ing">
                    <div className="create-ing-product">
                      {kstWorkingArr[0]?.crop_img === null ? (
                        <CropsNoIcon width={84} height={84} />
                      ) : (
                        <img
                          src={process.env.NEXT_PUBLIC_END_POINT + kstWorkingArr[0].crop_img}
                          className="working-crop-img"
                        />
                      )}

                      <div className="create-ing-text">
                        <div className="create-time">
                          <p>{kstWorkingArr[0].output_updated_at?.split("T")[1]?.slice(0, 5)}~</p>
                        </div>
                        <p>{kstWorkingArr[0].crop_name}</p>
                      </div>
                    </div>
                    <div className="production-count">
                      <p className="num">{kstWorkingArr[0].output}</p>
                      <p className="unit">개</p>
                    </div>
                  </div>
                ) : (
                  <div className="work-none">
                    <PlantIcon width={41} height={43} />
                    <p>현재 진행중인 작업이 없습니다.</p>
                  </div>
                )}
              </S.Proceeding>
              <S.Complete>
                <p className="complete-title">작업완료</p>
                <S.Line2 />
                <div className="list-wrap">
                  <div className="list-head">
                    <p>완료시간</p>
                    <p>작물명</p>
                    <p>총 파종량</p>
                  </div>
                  <S.ListBlockWrap>
                    <div className="list-inner">
                      {kstDoneArr?.length !== 0 ? (
                        <>
                          {kstDoneArr?.map((data, index) => {
                            return (
                              <S.ListBlock key={`map${index}`}>
                                <p className="text-one">{data.output_updated_at?.split("T")[1]?.slice(0, 5)}</p>
                                <div className="text-img-wrap">
                                  {data.crop_img === null ? (
                                    <CropsNoIcon width={32} height={32} />
                                  ) : (
                                    <>
                                      <img
                                        src={process.env.NEXT_PUBLIC_END_POINT + data.crop_img}
                                        className="done-crop-img"
                                      />
                                    </>
                                  )}
                                  <p className="text-two">{data.crop_name}</p>
                                </div>
                                <p className="text-three">{data.output}</p>
                              </S.ListBlock>
                            );
                          })}
                        </>
                      ) : (
                        <div className="work-none">
                          <PlantIcon width={41} height={43} />
                          <p>오늘 완료된 작업이 없습니다.</p>
                        </div>
                      )}
                    </div>
                  </S.ListBlockWrap>
                </div>
              </S.Complete>
            </div>
          </S.GraphWrap>
        </S.WrapInner>
        {pickerOpen && (
          <div className="modal-wrap">
            <DatePickerMain
              pickerOpen={pickerOpen}
              setPickerOpen={setPickerOpen}
              setDateRange={(calendarStartDate, calendarEndDate) => {
                setDateRange({ startDate: calendarStartDate, endDate: calendarEndDate });
              }}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>
        )}
      </S.Wrap>
    )
  );
}

export default RealTimeDetailModal;
