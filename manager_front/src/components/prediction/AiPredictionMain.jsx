import React, { useCallback, useState } from "react";
import styled from "styled-components";

import { NumberCommaFormatting, YYYYMMDDSlash } from "@src/utils/Formatting";

import DatePickerMain from "@components/statistics/DatePickerMain";

import NoIcon from "@images/setting/crops-no-img.svg";
import PickerIcon from "@images/statistics/date-picker-icon.svg";

const S = {
  Wrap: styled.div`
    background-color: #fff;
    padding: 32px 32px 27px 56px;
    display: flex;
    flex-direction: column;
    gap: 43px;

    .modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
      display: flex;
      justify-content: center;
    }
  `,
  TitleHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-text {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .title {
      ${({ theme }) => theme.textStyle.h4Bold};
      color: ${({ theme }) => theme.basic.deepBlue};
    }
    .sub-title {
      ${({ theme }) => theme.textStyle.h6Reguler};
      color: ${({ theme }) => theme.basic.gray50};
    }
  `,
  PlanterWrap: styled.div`
    display: flex;
    gap: 20px;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    overflow: auto;
    display: grid;

    .img-inner {
      cursor: pointer;
      border-radius: 100px;
      width: 184px;
      height: 184px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .yes-image {
      border-radius: 100px;
    }
  `,
  PlanterImg: styled.div`
    display: flex;
    img {
      cursor: pointer;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100px;
      width: 184px;
      height: 184px;
    }
  `,

  PlanterDetail: styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
    align-items: center;
    margin-bottom: 12px;
  `,
  PlanterText: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    p {
      ${({ theme }) => theme.textStyle.h7Bold};
    }
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

function AiPredictionMain({ setPlanterClick, planterChoose, setPlanterChoose, dateRange, setDateRange, planterData }) {
  //달력 모달 오픈
  const [pickerOpen, setPickerOpen] = useState(false);

  //달력 클릭
  const handlePickerClick = useCallback(() => {
    setPickerOpen(true);
  }, [pickerOpen]);

  // 작물 클릭시
  const handlePlanterChoose = useCallback((data) => {
    setPlanterChoose(data);
    setPlanterClick(true);
  }, []);

  return (
    <S.Wrap>
      <S.TitleHeader>
        <div className="title-text">
          <p className="title">생산량 예측</p>
          <p className="sub-title">작물별 파종량 대비 생산량 AI 예측</p>
        </div>
        <S.ClickPicker onClick={handlePickerClick}>
          <p>
            {YYYYMMDDSlash(dateRange.startDate)} ~ {YYYYMMDDSlash(dateRange.endDate)}
          </p>
          <PickerIcon width={19} height={19} />
        </S.ClickPicker>
      </S.TitleHeader>
      <S.PlanterWrap>
        {planterData?.map((data, index) => {
          return (
            <S.PlanterDetail key={`map${index}`}>
              {data.crop_image ? (
                <S.PlanterImg
                  className="yes-image"
                  style={{
                    border: planterChoose.crop_id === data.crop_id && "1px solid #5899fb",
                  }}
                  onClick={() => handlePlanterChoose(data)}>
                  <img src={process.env.NEXT_PUBLIC_END_POINT + data.crop_image} />
                </S.PlanterImg>
              ) : (
                <S.PlanterImg
                  className="img-inner"
                  style={{ border: planterChoose.crop_id === data.crop_id && "1px solid #5899fb" }}
                  onClick={() => handlePlanterChoose(data)}>
                  <NoIcon width={184} height={184} />
                </S.PlanterImg>
              )}
              <S.PlanterText>
                <p style={{ color: planterChoose.crop_id === data.crop_id ? "#5899FB" : "#737F8F" }}>
                  {data.crop_name}
                </p>
                <p style={{ color: planterChoose.crop_id === data.crop_id ? "#5899FB" : "#737F8F" }}>
                  {NumberCommaFormatting(data.ai_predict)}kg
                </p>
              </S.PlanterText>
            </S.PlanterDetail>
          );
        })}
      </S.PlanterWrap>
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
  );
}

export default AiPredictionMain;
