import React, { useCallback, useEffect, useState, useRef } from "react";
import styled, { css } from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";

const S = {
  Wrap: styled.div`
    width: 100%;

    .scroll-container {
      display: flex;
      overflow-x: auto;
      gap: 8px;
      padding: 0px 8px;
    }
  `,
  DayWrap: styled.div`
    min-width: 56px;
    max-width: 56px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 8px;
    cursor: pointer;

    .week-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.whiteGrey};
    }

    .day-text {
      ${({ theme }) => theme.textStyle.h4Bold}
      color: #ffffff;
    }

    ${(props) =>
      props.isSelected
        ? css`
            background-color: #5899fb;
          `
        : css`
            background-color: none;
          `}
  `,
};

function DefaultHorizontalCalendar({ date, handleDateChange }) {
  const container = useRef(null);
  const [oneMonthDay, setOneMonthDay] = useState([]);

  const getDaysInMonth = useCallback((year, month) => {
    // month는 0부터 시작하기 때문에 1을 뺍니다.
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    const daysArray = [];
    const week = ["일", "월", "화", "수", "목", "금", "토"];

    for (let day = 1; day <= lastDay; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayOfWeek = currentDate.getDay(); // 0(일요일)부터 6(토요일)까지의 값

      daysArray.push({
        dayOfMonth: day,
        dayOfWeek: week[dayOfWeek],
      });
    }

    return daysArray;
  }, []);

  // 오늘 날짜 화면 가운데로 포커싱
  useEffect(() => {
    if (container.current) {
      const xLocation = 64 * (new Date().getDate() - 1) - container.current.clientWidth / 2 + 28;
      container.current.scrollTo(xLocation, 0);
    }
  }, [oneMonthDay]);

  // 년도와 월에 따라 일 변경
  useEffect(() => {
    setOneMonthDay(getDaysInMonth(date.year, date.month));
  }, [date.year, date.month]);

  return (
    <S.Wrap>
      <ScrollContainer className="scroll-container" horizontal={true} innerRef={container}>
        {oneMonthDay.map((oneDay) => {
          return (
            <S.DayWrap
              key={oneDay.dayOfMonth}
              isSelected={date.day === oneDay.dayOfMonth}
              onClick={() => {
                handleDateChange("day", oneDay.dayOfMonth);
              }}>
              <p className="week-text">{oneDay.dayOfWeek}</p>
              {oneDay.dayOfMonth.toString().length === 1 && <p className="day-text">{"0" + oneDay.dayOfMonth}</p>}
              {oneDay.dayOfMonth.toString().length !== 1 && <p className="day-text">{oneDay.dayOfMonth}</p>}
            </S.DayWrap>
          );
        })}
      </ScrollContainer>
    </S.Wrap>
  );
}

export default DefaultHorizontalCalendar;
