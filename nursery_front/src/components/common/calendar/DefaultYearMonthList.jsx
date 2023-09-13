import React, { useEffect, useState } from "react";

import DefaultSelectList from "@components/common/select/DefaultSelectList";

import { GetMonthList, GetYearList } from "@utils/Formatting";
import OnRadioBtnIcon from "@images/common/on-radio-btn.svg";
import OffRadioBtnIcon from "@images/common/off-radio-btn.svg";

function DefaultYearMonthList({ isStatistics = false, date, yearMonthOpen, handleDateChange, handleYearMonthOpen }) {
  const yearList = GetYearList();
  const [monthList, setMonthList] = useState(GetMonthList(date.year));

  // 선택한 월이 변경한 년도에 없을 경우 가장 첫번째 월로 변경
  useEffect(() => {
    if (monthList.length !== 0 && !monthList.includes(date.month)) {
      handleDateChange("month", monthList[0]);
    }
  }, [monthList]);

  return (
    <>
      {yearMonthOpen.year && (
        <DefaultSelectList>
          <p className="select-category-text">년도</p>
          <div className="value-list-wrap" id="scroll-wrap">
            {yearList.map((year) => {
              return (
                <div
                  key={`year${year}`}
                  className={"row-layout"}
                  onClick={() => {
                    handleDateChange("year", year);
                    setMonthList(GetMonthList(year));
                    handleYearMonthOpen("year", false);
                  }}>
                  {year === date.year && <OnRadioBtnIcon />}
                  {year !== date.year && <OffRadioBtnIcon />}
                  <p className="value-text">{year}년</p>
                </div>
              );
            })}
          </div>
        </DefaultSelectList>
      )}
      {yearMonthOpen.month && (
        <DefaultSelectList>
          <p className="select-category-text">월</p>
          <div className="value-list-wrap" id="scroll-wrap">
            {isStatistics && (
              <div
                className="row-layout"
                onClick={() => {
                  handleDateChange("month", 0);
                  handleYearMonthOpen("month", false);
                }}>
                {date.month === 0 && <OnRadioBtnIcon />}
                {date.month !== 0 && <OffRadioBtnIcon />}
                <p className="value-text">전체</p>
              </div>
            )}
            {monthList.map((month) => {
              return (
                <div
                  key={`month${month}`}
                  className="row-layout"
                  onClick={() => {
                    handleDateChange("month", month);
                    handleYearMonthOpen("month", false);
                  }}>
                  {month === date.month && <OnRadioBtnIcon />}
                  {month !== date.month && <OffRadioBtnIcon />}
                  <p className="value-text">{month}월</p>
                </div>
              );
            })}
          </div>
        </DefaultSelectList>
      )}
    </>
  );
}

export default DefaultYearMonthList;
