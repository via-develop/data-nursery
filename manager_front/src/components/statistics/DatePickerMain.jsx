import React, { useCallback, useState } from "react";
import styled from "styled-components";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

import XIcon from "@images/common/icon-x.svg";
import CalendarArrowIcon from "@images/statistics/arrow-left.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;

    .date-picker {
      height: 36px;
      padding: 6px 12px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};
      background-color: ${({ theme }) => theme.blackWhite.white};
      border-radius: 8px;

      .react-daterange-picker__wrapper {
        border: none;
      }
    }
  `,

  PickerWrap: styled.div`
    background-color: white;
    position: absolute;
    padding: 16px;
    width: 588px;
    min-height: 400px;
    z-index: 1;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .title-wrap {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    p {
      color: ${({ theme }) => theme.basic.gray40};
      ${({ theme }) => theme.textStyle.h7Bold};
    }

    .x-wrap {
      cursor: pointer;
    }
    .react-datepicker {
      border: none;
      display: flex;
      gap: 24px;
    }
    .react-datepicker__header {
      background-color: ${({ theme }) => theme.blackWhite.white};
      border-bottom: none;
    }

    .react-datepicker__month-container {
      width: 258px;
    }

    .react-datepicker__day--keyboard-selected {
      background-color: #5899fb;
    }

    .react-datepicker__day--in-range {
      background-color: #f2f7fe;
      color: ${({ theme }) => theme.blackWhite.black};
    }
    .react-datepicker__day--in-range:hover {
      background-color: #d1d1d1;
    }
    .react-datepicker__day--in-selecting-range:not {
      background-color: #d1d1d1;
    }

    .customer-calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .react-datepicker__navigation {
      // 달 넘기기 위한 화살표
      position: relative;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }

    .react-datepicker__current-month {
      // 00월 0000년 글자
      font-family: Pretendard;
      color: #202223;
      font-size: 16px;
      font-weight: 600;
      line-height: 24px;
    }

    .rotate-180 {
      transform: rotate(180deg);
    }

    .react-datepicker__day--in-selecting-range:not(
        .react-datepicker__day--in-range,
        .react-datepicker__month-text--in-range,
        .react-datepicker__quarter-text--in-range,
        .react-datepicker__year-text--in-range
      ),
    .react-datepicker__month-text--in-selecting-range:not(
        .react-datepicker__day--in-range,
        .react-datepicker__month-text--in-range,
        .react-datepicker__quarter-text--in-range,
        .react-datepicker__year-text--in-range
      ),
    .react-datepicker__quarter-text--in-selecting-range:not(
        .react-datepicker__day--in-range,
        .react-datepicker__month-text--in-range,
        .react-datepicker__quarter-text--in-range,
        .react-datepicker__year-text--in-range
      ),
    .react-datepicker__year-text--in-selecting-range:not(
        .react-datepicker__day--in-range,
        .react-datepicker__month-text--in-range,
        .react-datepicker__quarter-text--in-range,
        .react-datepicker__year-text--in-range
      ) {
      background-color: #f2f7fe;
      color: #202223;
    }
  `,

  ButtonWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.primery.primery};
    border-radius: 8px;
    padding: 16px 40px;
    cursor: pointer;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h5Bold};
    }
  `,
  ButtonWrapOff: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 40px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      color: ${({ theme }) => theme.basic.gray30};
      ${({ theme }) => theme.textStyle.h5Bold};
    }
  `,
  Border: styled.div`
    border: 1px solid ${({ theme }) => theme.basic.lightSky};
    width: 100%;
    height: 1px;
    margin-top: 16px;
    margin-bottom: 16px;
  `,
};

function DatePickerMain({ pickerOpen, setPickerOpen, startDate, endDate, setDateRange }) {
  const [calendarStartDate, setCalendarStartDate] = useState(startDate);
  const [calendarEndDate, setCalendarEndDate] = useState(endDate);

  const handlePickerClose = useCallback(() => {
    setPickerOpen(false);
  }, []);

  const handleDateDone = useCallback(() => {
    setDateRange(calendarStartDate, calendarEndDate);
    handlePickerClose();
  }, [calendarStartDate, calendarEndDate]);

  return (
    <S.Wrap>
      {pickerOpen && (
        <S.PickerWrap>
          <div className="title-wrap">
            <p>기간을 선택하세요</p>
            <div className="x-wrap" onClick={handlePickerClose}>
              <XIcon width={24} height={24} />
            </div>
          </div>
          <DatePicker
            selectsRange={true}
            startDate={calendarStartDate}
            endDate={calendarEndDate}
            onChange={(update) => {
              // setDateRange(update);
              setCalendarStartDate(update[0]);
              setCalendarEndDate(update[1]);
            }}
            monthsShown={2}
            locale={ko}
            inline
            renderCustomHeader={({ monthDate, decreaseMonth, increaseMonth }) => (
              <div className="customer-calendar-header">
                <button
                  aria-label="Previous Month"
                  className={"react-datepicker__navigation react-datepicker__navigation--previous"}
                  onClick={decreaseMonth}>
                  <CalendarArrowIcon />
                </button>
                <span className="react-datepicker__current-month">
                  {monthDate.toLocaleString("ko-KR", {
                    month: "long",
                  })}{" "}
                  {monthDate.toLocaleString("ko-KR", {
                    year: "numeric",
                  })}
                </span>
                <button
                  aria-label="Next Month"
                  className={"react-datepicker__navigation react-datepicker__navigation--next"}
                  onClick={increaseMonth}>
                  <CalendarArrowIcon className={"rotate-180"} />
                </button>
              </div>
            )}
          />

          <S.Border />
          {calendarStartDate === null || calendarEndDate === null ? (
            <S.ButtonWrapOff>
              <p>날짜 선택 완료</p>
            </S.ButtonWrapOff>
          ) : (
            <S.ButtonWrap onClick={handleDateDone}>
              <p>날짜 선택 완료</p>
            </S.ButtonWrap>
          )}
        </S.PickerWrap>
      )}
    </S.Wrap>
  );
}

export default DatePickerMain;
