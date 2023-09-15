import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko";

import FontSmallDefaultButton from "@components/common/button/FontSmallDefaultButton";

import CalendarArrowIcon from "@images/work/calendar-arrow.svg";
import CloseIcon from "@images/common/close-icon.svg";
import { borderButtonColor } from "@utils/ButtonColor";

const S = {
  BackGroundWrap: styled.div`
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    position: absolute;
    z-index: 99;
    top: 0%;
    left: 0%;
  `,
  Wrap: styled.div`
    max-height: 90svh;
    overflow-y: auto;
    position: absolute;
    z-index: 99;
    top: 50%;
    left: calc(50% - 156px);
    background-color: #ffffff;

    width: 312px;
    border-radius: 8px;
    padding: 16px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    transform: translate3d(0%, -50%, 0);
  `,
  CloseHeader: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;

    p {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey40};
    }

    .close-icon-wrap {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      cursor: pointer;
    }
  `,
  CustomCalendar: styled.div`
    width: 100%;
    height: fit-content;

    .rotate-180 {
      transform: rotate(180deg);
    }

    .react-datepicker-wrapper {
      width: 100%;
    }

    .react-datepicker {
      width: 100%;
      border: none;
    }

    .react-datepicker-popper {
      width: calc(100% - 48px);
    }

    .react-datepicker__month-container {
      width: 100%;
    }

    .react-datepicker__triangle {
      // 달력 상단 트라이앵글
      display: none;
    }

    .react-datepicker__header {
      // 상단부분
      background-color: #ffffff;
      border-bottom: none;
      padding: 0px 0px 15px 0px;

      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .customer-calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .react-datepicker__navigation {
      // 달 넘기기 위한 화살표
      position: relative;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: ${({ theme }) => theme.basic.lightSky};
      border-radius: 8px;
    }

    .react-datepicker__header__dropdown react-datepicker__header__dropdown--scroll {
      display: none;
    }

    .react-datepicker__day-names,
    .react-datepicker__week {
      // 요일부분 및 주부분
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: 0px 8px;
    }

    .react-datepicker__day-name {
      // 요일 글자
      ${({ theme }) => theme.textStyle.h6Regular}
      color: #979797;
      width: 36px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px;
    }

    .react-datepicker__current-month {
      // 00월 0000년 글자
      font-family: Pretendard;
      ${({ theme }) => theme.textStyle.h3Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }

    .react-datepicker__month {
      // 일 전체 부분
      margin: 0px;
      padding: 0px;
    }

    .react-datepicker__day {
      // 일 글자
      ${({ theme }) => theme.textStyle.h6Regular}
      color: #515151;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0px;
    }

    .react-datepicker__day--selected {
      // 선택된 날짜
      font-weight: 700;
      color: #ffffff;
      background-color: #5899fb;
      border-radius: 50%;
    }

    .react-datepicker__day:hover {
      border-radius: 50%;
    }

    // 선택 불가 날짜
    .react-datepicker__day--disabled {
      color: #cccccc;
    }
  `,
  Divider: styled.div`
    width: 100%;
    height: 1px;
    background-color: ${({ theme }) => theme.basic.lightSky};
    margin: 8px 0px 16px 0px;
  `,
};

function DefaultCalendar({ calendarOpen, setCalendarOpen, sowingDate }) {
  const [selectDate, setSelectDate] = useState("");

  const closeModal = useCallback(() => {
    setSelectDate("");
    setCalendarOpen({
      open: false, // 오픈 여부
      type: "", // 파종일, 출하일
      date: "", // 선택한 날짜
      afterFn: null, // 선택완료 버튼 클릭 시 실행
    });
  }, []);

  const selectComplete = useCallback(() => {
    if (selectDate === "") {
      calendarOpen.afterFn(calendarOpen.date);
    } else {
      calendarOpen.afterFn(selectDate);
    }

    closeModal();
  }, [selectDate, calendarOpen]);

  return (
    calendarOpen.open && (
      <S.BackGroundWrap>
        <S.Wrap>
          <S.CloseHeader>
            <p>{calendarOpen.type}을 선택하세요</p>
            <div className="close-icon-wrap">
              <CloseIcon fill={"#000000"} onClick={closeModal} />
            </div>
          </S.CloseHeader>
          <S.CustomCalendar>
            <DatePicker
              selected={selectDate === "" ? calendarOpen.date : selectDate}
              minDate={calendarOpen.type === "출하일" ? sowingDate : null}
              onChange={(date) => setSelectDate(date)}
              locale={ko}
              inline
              disabledKeyboardNavigation //다른달에도 해당일자에 색표시되는거 제거
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
          </S.CustomCalendar>
          <S.Divider />
          <FontSmallDefaultButton text={"선택완료"} onClick={selectComplete} customStyle={borderButtonColor} />
        </S.Wrap>
      </S.BackGroundWrap>
    )
  );
}

export default DefaultCalendar;
