import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";

import colorArray from "@components/common/ListColor";
import useStatics from "@src/hooks/queries/auth/useStatics";
import useFarmHouseIdList from "@src/hooks/queries/auth/useFarmHouseIdList";
import useFarmHouseNameList from "@src/hooks/queries/auth/useFarmHouseNameList";
import useCropNameList from "@src/hooks/queries/crop/useCropNameList";
import useTrayTotalList from "@src/hooks/queries/planter/useTrayTotalList";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useStaticsListDownload from "@src/hooks/queries/auth/useStaticsListDownload";

import DatePickerMain from "./DatePickerMain";
import SearchDropdown from "./SearchDropdown";

import { NumberCommaFormatting } from "@src/utils/Formatting";
import { GetMonthList, GetYearList, YYYYMMDDDash, YYYYMMDDSlash } from "@src/utils/Formatting";
import ExcelIcon from "@images/management/excel-icon.svg";
import DownArrow from "@images/common/order-by-up-icon.svg";
import UpArrow from "@images/common/order-by-down-icon.svg";
import FinCheckIcon from "@images/statistics/fin-check-icon.svg";
import WaitingIcon from "@images/statistics/waiting-icon.svg";
import GrayFinCheckIcon from "@images/statistics/gray-fin-check-icon.svg";
import GrayWaitingIcon from "@images/statistics/gray-waiting-icon.svg";
import HeaderSelectArrowIcon from "@images/statistics/header-icon-arrow.svg";
import SelectArrowIcon from "@images/statistics/icon-arrow.svg";
import PickerIcon from "@images/statistics/date-picker-icon.svg";
import { staticsKey } from "@src/utils/query-keys/AuthQueryKeys";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;

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
  InfoBlock: styled.div`
    background-color: #fff;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .top-div {
      z-index: 99;
    }

    .month-dropdown-list {
      left: 279px;
      width: 120px !important;
    }

    .info-wrap {
      display: flex;
      justify-content: space-between;
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-title {
      ${({ theme }) => theme.textStyle.h4Bold}
      color:${({ theme }) => theme.basic.deepBlue}
    }

    .sub-wrap {
      display: flex;
      align-items: center;
    }

    .info-sub {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray50}
    }

    .button-wrap {
      display: flex;
      gap: 16px;
    }
  `,
  ExcelButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border: 1px solid #5899fb;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: #5899fb;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.lightSky};
    }
  `,
  DateChooseWrap: styled.div`
    display: flex;
    gap: 8px;
    margin-top: 13px;
  `,
  YearDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 6px 16px;
    width: 138px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,
  MonthDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.blackWhite.white};
    border-radius: 8px;
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px 6px 16px;
    width: 120px;

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,
  HeaderDropDown: styled.div`
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: #f7f7f9;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 6px 6px 16px;
    select {
      cursor: pointer;
      -webkit-appearance: none;
      border: none;
      outline: none;
      width: 100%;
      background-color: #f7f7f9;
    }

    p {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
    }
  `,

  ContentList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;

    .list-table-head {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;
      padding: 6px 32px 6px 24px;
      min-width: 1500px;
      p {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .search-select-modal-wrap {
        position: relative;
      }

      .no {
        width: 42px;
      }
      .farm-name {
        width: 125px;
      }

      .order-count {
        width: 115px;
      }
      .sowing {
        width: 115px;
      }
      .state {
        width: 98px;
      }
    }
    p {
      ${({ theme }) => theme.textStyle.h7Reguler};
      color: ${({ theme }) => theme.basic.gray60};
    }

    .arrow-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .order-none-icon {
      width: 24px;
      height: 24px;
      margin-bottom: 5px;
      ${({ theme }) => theme.textStyle.h3Bold}
      color: ${({ theme }) => theme.basic.gray50};
    }

    .icon-wrap {
      cursor: pointer;
      align-items: center;
      display: flex;
      width: 24px;
      height: 24px;
    }

    .check-box {
      cursor: pointer;
    }

    .delete {
      border: 1px solid ${({ theme }) => theme.basic.whiteGray};
      box-shadow: none;

      p {
        color: #c6c6c6;
        ${({ theme }) => theme.textStyle.h7Bold};
      }
    }
  `,
  ListBlock: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    height: 68px;
    background-color: #fff;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    border-radius: 8px;
    align-items: center;
    margin-bottom: 16px;

    p {
      ${({ theme }) => theme.textStyle.h7Bold};
      color: ${({ theme }) => theme.basic.gray50};
      display: flex;
      align-items: center;
    }

    .list_id {
      width: 42px;
      justify-content: center;
    }
    .farm_id {
      width: 128px;
      justify-content: center;
    }
    .farm_name {
      width: 180px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .farm_plant {
      width: 111px;
      justify-content: center;
    }
    .plant_name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 131px;
      justify-content: center;
    }
    .tray {
      width: 117px;
      justify-content: center;
    }
    .order_count {
      width: 74px;
      justify-content: center;
    }
    .sowing_count {
      width: 102px;
      justify-content: center;
      color: ${({ theme }) => theme.basic.deepBlue};
      ${({ theme }) => theme.textStyle.h7Bold};
    }
    .sowing_date {
      width: 86px;
      justify-content: center;
      color: ${({ theme }) => theme.basic.gray40};
      ${({ theme }) => theme.textStyle.h7Semibold}
    }

    .farm_name_wrap {
      display: flex;
      gap: 8px;
      width: 209px;
      justify-content: start;
      align-items: center;

      .farm_name {
        display: block !important;
      }
    }

    .farm-name-first {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 30px;
      padding: 8px;
      color: #fff;
    }
  `,
  ButtonWrap: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MoreButton: styled.div`
    cursor: pointer;
    border-radius: 8px;
    width: 280px;
    padding: 16px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray60}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.recOutline};
    }
  `,
  EmptyData: styled.div`
    margin-top: 168px;
    gap: 14px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h5Reguler}
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
  YearMonthDropDownList: styled.div`
    position: absolute;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    max-height: 300px;
    top: 282px;
    padding: 16px;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    width: 138px;
    overflow-y: auto;

    .drop-down-list {
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: start;
      cursor: pointer;
      background-color: ${({ theme }) => theme.basic.whiteGray};

      p {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
      }
    }
    .drop-down-list:hover {
      background-color: ${({ theme }) => theme.basic.gray20};
      border-radius: 4px;
    }
  `,
  SearchSelectBox: styled.div`
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    background-color: #f7f7f9;
    padding: 6px 6px 6px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
};

function StatisticsStatus() {
  const invalidateQueries = useInvalidateQueries();

  // 통계현황 페이지
  const [page, setPage] = useState(1);

  const [isAddDataClick, setIsAddDataClick] = useState(false); // 더보기 클릭 여부

  // 통계현황 검색 조건
  const [selectData, setSelectData] = useState({
    farmHouseId: "",
    farmHouseName: "",
    cropName: "",
    cropKindOrderType: 2,
    trayTotal: "",
    orderQuantityOrderType: 2,
    planterOutputOrderType: 2,
    sowingDateOrderType: 0,
    isShipmentCompletedOrderType: 2,
  });

  // Dropdown 검색어
  const [searchFarmHouseId, setSearchFarmHouseId] = useState("");
  const [searchFarmHouseName, setSearchFarmHouseName] = useState("");
  const [searchCropName, setSearchCropName] = useState("");
  const [searchTrayTotal, setSearchTrayTotal] = useState("");

  //Dropdown 나타내는 글씨
  const [farmIdSelectText, setFarmIdSelectText] = useState("");
  const [farmNameSelectText, setFarmNameSelectText] = useState("");
  const [cropNameSelectText, setCropNameSelectText] = useState("");
  const [traySelectText, setTraySelectText] = useState("");

  // 농가목록 데이터
  const [staticsList, setStaticsList] = useState([]);

  // 선택된 연도
  const [selectYear, setSelectYear] = useState(0);
  //선택된 월
  const [selectMonth, setSelectMonth] = useState(0);

  //연도별 drop down 모달 오픈
  const [yearModalOpen, setYearModalOpen] = useState(false);

  //월별 drop down 모달 오픈
  const [monthModalOpen, setMonthModalOpen] = useState(false);

  //달력 모달 오픈
  const [pickerOpen, setPickerOpen] = useState(false);

  //연도 데이터
  const yearList = GetYearList();
  //월 데이터
  const [monthList, setMonthList] = useState([]);

  //농가 id 드롭다운 모달 오픈
  const [isFarmId, setIsFarmId] = useState(false);

  //농가명 드롭다운 모달 오픈
  const [isFarmName, setIsFarmName] = useState(false);

  //작물명 드롭다운 모달 오픈
  const [isCropsName, setIsCropsName] = useState(false);

  //트레이 드롭다운 모달 오픈
  const [isTrayCount, setIsTrayCount] = useState(false);

  // 연도별 클릭시
  const handelYearDropDown = useCallback(() => {
    if (yearModalOpen) {
      setYearModalOpen(false);
    } else {
      setYearModalOpen(true);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [yearModalOpen, monthModalOpen, isFarmId, isFarmName, isCropsName, isTrayCount]);

  //월별 클릭시
  const handelMonthDropDown = useCallback(() => {
    if (monthModalOpen) {
      setMonthModalOpen(false);
    } else {
      setMonthModalOpen(true);
      setYearModalOpen(false);
      setIsFarmId(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [monthModalOpen, yearModalOpen, isCropsName, isFarmId, isFarmName, isTrayCount]);

  //연도별 drop down 내용 클릭
  const handleClickYearDropList = useCallback(
    (data) => {
      setSelectYear(data);
      setDateRange({
        startDate: null,
        endDate: null,
      });
      setMonthList(GetMonthList(data));
      setYearModalOpen(false);
      // 통계현황 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([staticsKey]);
    },
    [selectYear],
  );

  //월별 drop down 내용 클릭
  const handleClickMonthDropList = useCallback(
    (data) => {
      setSelectMonth(data);
      setMonthModalOpen(false);
      // 통계현황 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([staticsKey]);
    },
    [selectMonth, monthModalOpen],
  );

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  //달력 클릭
  const handlePickerClick = useCallback(() => {
    setPickerOpen(true);
    setYearModalOpen(false);
    setMonthModalOpen(false);
    setIsFarmId(false);
    setIsFarmName(false);
    setIsCropsName(false);
    setIsTrayCount(false);
  }, [pickerOpen, yearModalOpen, monthModalOpen, isFarmId, isFarmName, isCropsName, isTrayCount]);

  // 농가 id 드롭다운 클릭
  const handleFarmIdClick = useCallback(() => {
    if (isFarmId) {
      setIsFarmId(false);
    } else {
      setIsFarmId(true);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmName(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [isFarmId, yearModalOpen, monthModalOpen, isFarmName, isCropsName, isTrayCount]);

  // 농가명 드롭다운 클릭
  const handleFarmNameClick = useCallback(() => {
    if (isFarmName) {
      setIsFarmName(false);
    } else {
      setIsFarmName(true);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsCropsName(false);
      setIsTrayCount(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount]);

  // 작물명 드롭다운 클릭
  const handleCropsNameClick = useCallback(() => {
    if (isCropsName) {
      setIsCropsName(false);
    } else {
      setIsCropsName(true);
      setIsFarmName(false);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
      setIsTrayCount(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount]);

  // 트레이 드롭다운 클릭
  const handleTrayCountClick = useCallback(() => {
    if (isTrayCount) {
      setIsTrayCount(false);
    } else {
      setIsTrayCount(true);
      setIsCropsName(false);
      setIsFarmName(false);
      setYearModalOpen(false);
      setMonthModalOpen(false);
      setIsFarmId(false);
    }
  }, [isFarmName, yearModalOpen, monthModalOpen, isFarmId, isCropsName, isTrayCount, isTrayCount]);

  // 통계현황 검색 조건 선택
  const handleSelectChange = useCallback(
    (isSelect, name, value) => {
      setPage(1);
      setStaticsList([]);

      if (isSelect === undefined) {
        setSelectData((prev) => ({
          // 정렬 값
          ...prev,
          [name]: value,
        }));

        if (value === 0) {
          if (name === "cropKindOrderType") {
            setSelectData((prev) => ({
              ...prev,
              orderQuantityOrderType: 2,
              planterOutputOrderType: 2,
              sowingDateOrderType: 2,
              isShipmentCompletedOrderType: 2,
            }));
          } else if (name === "orderQuantityOrderType") {
            setSelectData((prev) => ({
              ...prev,
              cropKindOrderType: 2,
              planterOutputOrderType: 2,
              sowingDateOrderType: 2,
              isShipmentCompletedOrderType: 2,
            }));
          } else if (name === "planterOutputOrderType") {
            setSelectData((prev) => ({
              ...prev,
              cropKindOrderType: 2,
              orderQuantityOrderType: 2,
              sowingDateOrderType: 2,
              isShipmentCompletedOrderType: 2,
            }));
          } else if (name === "sowingDateOrderType") {
            setSelectData((prev) => ({
              ...prev,
              cropKindOrderType: 2,
              planterOutputOrderType: 2,
              orderQuantityOrderType: 2,
              isShipmentCompletedOrderType: 2,
            }));
          } else {
            setSelectData((prev) => ({
              ...prev,
              cropKindOrderType: 2,
              planterOutputOrderType: 2,
              orderQuantityOrderType: 2,
              sowingDateOrderType: 2,
            }));
          }
        }
      } else {
        // dropdown으로 선택하는 값
        const preValue = selectData[name].toString();
        let changeValue = "";

        if (isSelect) {
          // 선택된 항목 클릭 시 실행
          changeValue = preValue
            .split("||")
            .filter((data) => data !== value)
            .join("||");
        } else {
          // 미선택된 항목 클릭 시 실행
          if (preValue === "") {
            changeValue = value;
          } else {
            changeValue = preValue + "||" + value;
          }
        }

        setSelectData((prev) => ({
          ...prev,
          [name]: changeValue,
        }));
      }
      // 통계현황 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([staticsKey]);
    },
    [selectData],
  );

  // 통계현황 API
  const { data: staticsInfo } = useStatics({
    year: selectYear,
    month: selectMonth,
    dateRange:
      dateRange.startDate === null || dateRange.endDate === null
        ? ""
        : YYYYMMDDDash(dateRange.startDate) + "||" + YYYYMMDDDash(dateRange.endDate),
    farmHouseId: selectData.farmHouseId,
    farmHouseName: selectData.farmHouseName,
    cropName: selectData.cropName,
    cropKindOrderType: selectData.cropKindOrderType,
    trayTotal: selectData.trayTotal,
    orderQuantityOrderType: selectData.orderQuantityOrderType,
    planterOutputOrderType: selectData.planterOutputOrderType,
    sowingDateOrderType: selectData.sowingDateOrderType,
    isShipmentCompletedOrderType: selectData.isShipmentCompletedOrderType,
    page: page,
    successFn: (res) => {
      if (res.total === 0) {
        setStaticsList([]);
      } else if (isAddDataClick) {
        setStaticsList((prev) => [...prev, ...res.data]);
      } else {
        setStaticsList(res.data);
        setIsAddDataClick(false);
      }
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  // 농가ID 목록 API
  const { data: farmHouseIdList } = useFarmHouseIdList({
    searchText: searchFarmHouseId,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 농가명 목록 API
  const { data: farmHouseNameList } = useFarmHouseNameList({
    searchText: searchFarmHouseName,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작물명 목록 API
  const { data: cropNameList } = useCropNameList({
    searchText: searchCropName,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 트레이 총 홀 수 목록 API
  const { data: trayTotalList } = useTrayTotalList({
    searchText: searchTrayTotal,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  //농가 ID select box 글씨
  useEffect(() => {
    if (selectData.farmHouseId === "") {
      setFarmIdSelectText("농가ID");
    } else if (selectData?.farmHouseId?.includes("||")) {
      setFarmIdSelectText(
        selectData?.farmHouseId.split("||")[0] + "외 " + (selectData?.farmHouseId.split("||").length - 1) + "개",
      );
    } else {
      setFarmIdSelectText(selectData?.farmHouseId);
    }
  }, [selectData, farmIdSelectText]);

  //농가면 select box 글씨
  useEffect(() => {
    if (selectData.farmHouseName === "") {
      setFarmNameSelectText("농가명");
    } else if (selectData?.farmHouseName?.includes("||")) {
      setFarmNameSelectText(
        selectData?.farmHouseName.split("||")[0] + "외 " + (selectData?.farmHouseName.split("||").length - 1) + "개",
      );
    } else {
      setFarmNameSelectText(selectData?.farmHouseName);
    }
  }, [selectData, farmNameSelectText]);

  //작물명 select box 글씨
  useEffect(() => {
    if (selectData.cropName === "") {
      setCropNameSelectText("작물명");
    } else if (selectData?.cropName?.includes("||")) {
      setCropNameSelectText(
        selectData?.cropName.split("||")[0] + "외 " + (selectData?.cropName.split("||").length - 1) + "개",
      );
    } else {
      setCropNameSelectText(selectData?.cropName);
    }
  }, [cropNameSelectText, selectData]);

  //트레이 select box 글씨
  useEffect(() => {
    if (selectData?.trayTotal === "") {
      setTraySelectText("트레이");
    }
    // 두개 이상선택시
    else if (selectData?.trayTotal?.includes("||")) {
      setTraySelectText(
        selectData?.trayTotal.split("||")[0] + "외 " + (selectData?.trayTotal.split("||").length - 1) + "개",
      );
    } else {
      setTraySelectText(selectData?.trayTotal);
    }
  }, [traySelectText, selectData]);

  const { data: staticsListDownload } = useStaticsListDownload({
    year: selectYear,
    month: selectMonth,
    dateRange:
      dateRange.startDate === null || dateRange.endDate === null
        ? ""
        : YYYYMMDDDash(dateRange.startDate) + "||" + YYYYMMDDDash(dateRange.endDate),
    farmHouseId: selectData.farmHouseId,
    farmhouseName: selectData.farmHouseName,
    cropName: selectData.cropName,
    trayTotal: selectData.trayTotal,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 엑셀 다운로드 버튼
  const handleExcelClick = useCallback(() => {
    try {
      if (staticsListDownload === undefined) {
        return;
      }
      const url = window.URL.createObjectURL(new Blob([staticsListDownload.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "planter_work_list.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("엑셀 내려받기에 실패하였습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [staticsListDownload]);

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="block-inner">
          <div className="info-wrap">
            <div className="text-wrap">
              <p className="info-title">통계현황</p>
              <div className="sub-wrap">
                <p className="info-sub">통계보기 및 검색 (</p>
                <DownArrow width={15} height={15} />
                <p className="info-sub">정렬기능 )</p>
              </div>
              <S.DateChooseWrap>
                <S.YearDropDown onClick={handelYearDropDown}>
                  {selectYear === 0 ? <p>연도별</p> : <p>{selectYear}</p>}
                  <SelectArrowIcon width={24} height={24} />
                </S.YearDropDown>
                <S.MonthDropDown onClick={handelMonthDropDown}>
                  {selectMonth === 0 ? <p>월별</p> : <p>{selectMonth}</p>}
                  <SelectArrowIcon width={24} height={24} />
                </S.MonthDropDown>
                {dateRange.startDate === null || dateRange.endDate === null ? (
                  <S.ClickPicker onClick={handlePickerClick}>
                    <p>직접선택</p>
                    <PickerIcon width={19} height={19} />
                  </S.ClickPicker>
                ) : (
                  <S.ClickPicker onClick={handlePickerClick}>
                    <p>
                      {YYYYMMDDSlash(dateRange.startDate)} ~ {YYYYMMDDSlash(dateRange.endDate)}
                    </p>
                    <PickerIcon width={19} height={19} />
                  </S.ClickPicker>
                )}
              </S.DateChooseWrap>
              {yearModalOpen && (
                <S.YearMonthDropDownList className="top-div">
                  {yearList.map((data, index) => {
                    return (
                      <div className="drop-down-list" onClick={() => handleClickYearDropList(data)} key={`map${index}`}>
                        <p>{data}</p>
                      </div>
                    );
                  })}
                </S.YearMonthDropDownList>
              )}
              {monthModalOpen && (
                <S.YearMonthDropDownList className="top-div month-dropdown-list">
                  {monthList.map((data, index) => {
                    return (
                      <div
                        className="drop-down-list"
                        onClick={() => handleClickMonthDropList(data)}
                        key={`map${index}`}>
                        <p>{data}</p>
                      </div>
                    );
                  })}
                </S.YearMonthDropDownList>
              )}
            </div>
          </div>
        </div>
        <div>
          {staticsList.length !== 0 && (
            <div className="button-wrap">
              <S.ExcelButton onClick={handleExcelClick}>
                <ExcelIcon width={20} height={25} />
                <p>엑셀 내려받기</p>
              </S.ExcelButton>
            </div>
          )}
        </div>
      </S.InfoBlock>
      <S.ContentList>
        <div className="list-table-head">
          <p className="no">NO</p>

          <div className="search-select-modal-wrap">
            <S.HeaderDropDown style={{ width: "168px" }} onClick={handleFarmIdClick}>
              <p>{farmIdSelectText}</p>
              <HeaderSelectArrowIcon width={20} height={20} />
            </S.HeaderDropDown>
            {isFarmId && (
              <SearchDropdown
                width={"168px"}
                type={"farmHouseId"}
                dataList={farmHouseIdList}
                selectData={selectData.farmHouseId}
                searchText={searchFarmHouseId}
                setSearchText={setSearchFarmHouseId}
                dataClick={handleSelectChange}
              />
            )}
          </div>

          <div className="search-select-modal-wrap">
            <S.HeaderDropDown style={{ width: "224px" }} onClick={handleFarmNameClick}>
              <p>{farmNameSelectText}</p>
              <HeaderSelectArrowIcon width={20} height={20} />
            </S.HeaderDropDown>
            {isFarmName && (
              <SearchDropdown
                width={"224px"}
                type={"farmHouseName"}
                dataList={farmHouseNameList}
                selectData={selectData.farmHouseName}
                searchText={searchFarmHouseName}
                setSearchText={setSearchFarmHouseName}
                dataClick={handleSelectChange}
              />
            )}
          </div>

          <div className="search-select-modal-wrap">
            <S.HeaderDropDown style={{ width: "154px" }} onClick={handleCropsNameClick}>
              <p>{cropNameSelectText}</p>
              <HeaderSelectArrowIcon width={20} height={20} />
            </S.HeaderDropDown>
            {isCropsName && (
              <SearchDropdown
                width={"154px"}
                type={"cropName"}
                dataList={cropNameList}
                selectData={selectData.cropName}
                searchText={searchCropName}
                setSearchText={setSearchCropName}
                dataClick={handleSelectChange}
              />
            )}
          </div>
          <div className="arrow-wrap farm-name">
            <p>품종명</p>
            <div className="icon-wrap">
              {selectData.cropKindOrderType === 0 && (
                <UpArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "cropKindOrderType", 1);
                  }}
                />
              )}
              {selectData.cropKindOrderType === 1 && (
                <DownArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "cropKindOrderType", 2);
                  }}
                />
              )}
              {selectData.cropKindOrderType === 2 && (
                <p
                  className="order-none-icon"
                  onClick={() => {
                    handleSelectChange(undefined, "cropKindOrderType", 0);
                  }}>
                  -
                </p>
              )}
            </div>
          </div>

          <div className="search-select-modal-wrap">
            <S.HeaderDropDown style={{ width: "154px" }} onClick={handleTrayCountClick}>
              <p>{traySelectText}</p>
              <HeaderSelectArrowIcon width={20} height={20} />
            </S.HeaderDropDown>
            {isTrayCount && (
              <SearchDropdown
                width={"154px"}
                type={"trayTotal"}
                dataList={trayTotalList}
                selectData={selectData.trayTotal}
                searchText={searchTrayTotal}
                setSearchText={setSearchTrayTotal}
                dataClick={handleSelectChange}
              />
            )}
          </div>

          <div className="arrow-wrap order-count">
            <p>주문수량</p>
            <div className="icon-wrap">
              {selectData.orderQuantityOrderType === 0 && (
                <UpArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "orderQuantityOrderType", 1);
                  }}
                />
              )}
              {selectData.orderQuantityOrderType === 1 && (
                <DownArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "orderQuantityOrderType", 2);
                  }}
                />
              )}
              {selectData.orderQuantityOrderType === 2 && (
                <p
                  className="order-none-icon"
                  onClick={() => {
                    handleSelectChange(undefined, "orderQuantityOrderType", 0);
                  }}>
                  -
                </p>
              )}
            </div>
          </div>
          <div className="arrow-wrap sowing">
            <p>파종량</p>
            <div className="icon-wrap">
              {selectData.planterOutputOrderType === 0 && (
                <UpArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "planterOutputOrderType", 1);
                  }}
                />
              )}
              {selectData.planterOutputOrderType === 1 && (
                <DownArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "planterOutputOrderType", 2);
                  }}
                />
              )}
              {selectData.planterOutputOrderType === 2 && (
                <p
                  className="order-none-icon"
                  onClick={() => {
                    handleSelectChange(undefined, "planterOutputOrderType", 0);
                  }}>
                  -
                </p>
              )}
            </div>
          </div>
          <div className="arrow-wrap sowing">
            <p>파종일자</p>
            <div className="icon-wrap">
              {selectData.sowingDateOrderType === 0 && (
                <UpArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "sowingDateOrderType", 1);
                  }}
                />
              )}
              {selectData.sowingDateOrderType === 1 && (
                <DownArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "sowingDateOrderType", 2);
                  }}
                />
              )}
              {selectData.sowingDateOrderType === 2 && (
                <p
                  className="order-none-icon"
                  onClick={() => {
                    handleSelectChange(undefined, "sowingDateOrderType", 0);
                  }}>
                  -
                </p>
              )}
            </div>
          </div>
          <div className="arrow-wrap state">
            <p>출하상태</p>
            <div className="icon-wrap">
              {selectData.isShipmentCompletedOrderType === 0 && (
                <UpArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "isShipmentCompletedOrderType", 1);
                  }}
                />
              )}
              {selectData.isShipmentCompletedOrderType === 1 && (
                <DownArrow
                  width={24}
                  height={24}
                  onClick={() => {
                    handleSelectChange(undefined, "isShipmentCompletedOrderType", 2);
                  }}
                />
              )}
              {selectData.isShipmentCompletedOrderType === 2 && (
                <p
                  className="order-none-icon"
                  onClick={() => {
                    handleSelectChange(undefined, "isShipmentCompletedOrderType", 0);
                  }}>
                  -
                </p>
              )}
            </div>
          </div>
        </div>
        {staticsList.length === 0 ? (
          <S.EmptyData>
            <img src="/images/statistics/w-icon-graph.png" alt="statistics-icon" />
            <p>등록된 통계현황이 없습니다.</p>
          </S.EmptyData>
        ) : (
          staticsList.map((data, index) => {
            return (
              <S.ListBlock key={`statics${data.id}`} className={data.farmhouse.is_del && "delete"}>
                <p className="list_id">{index + 1}</p>
                <p className="farm_id">{data.farmhouse.farm_house_id === null ? "-" : data.farmhouse.farm_house_id}</p>
                <div className="farm_name_wrap">
                  <div className="farm-name-first" style={{ backgroundColor: colorArray[data.id % 20] }}>
                    {data.farmhouse.name === null ? "-" : data.farmhouse.name.slice(0, 1)}
                  </div>
                  <p className="farm_name">{data.farmhouse.name === null ? "-" : data.farmhouse.name}</p>
                </div>
                <p className="farm_plant">{data.crop.name}</p>
                <p className="plant_name">{data.crop_kind}</p>
                <p className="tray">{data.planter_tray.total}</p>
                <p className="order_count">{NumberCommaFormatting(data.order_quantity)}</p>
                <p className="sowing_count">{NumberCommaFormatting(data.planter_output.output)}</p>
                <p className="sowing_date">{YYYYMMDDSlash(data.sowing_date)}</p>
                {!!data.is_shipment_completed && !data.farmhouse.is_del ? (
                  <FinCheckIcon width={98} height={40} />
                ) : !data.is_shipment_completed && !data.farmhouse.is_del ? (
                  <WaitingIcon width={98} height={40} />
                ) : !!data.is_shipment_completed && !!data.farmhouse.is_del ? (
                  <GrayFinCheckIcon width={98} height={40} />
                ) : !data.is_shipment_completed && !!data.farmhouse.is_del ? (
                  <GrayWaitingIcon width={98} height={40} />
                ) : (
                  <></>
                )}
              </S.ListBlock>
            );
          })
        )}
        {staticsInfo?.total !== 0 && staticsList.length !== staticsInfo?.total && staticsInfo !== undefined && (
          <S.ButtonWrap>
            <S.MoreButton
              onClick={() => {
                setIsAddDataClick(true);
                setPage(page + 1);
              }}>
              <p>더보기</p>
            </S.MoreButton>
          </S.ButtonWrap>
        )}
      </S.ContentList>
      {pickerOpen && (
        <div className="modal-wrap">
          <DatePickerMain
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
            setDateRange={(calendarStartDate, calendarEndDate) => {
              setDateRange({ startDate: calendarStartDate, endDate: calendarEndDate });
              setSelectYear(0);
              setSelectMonth(0); // 통계현황 정보 다시 불러오기 위해 쿼리키 삭제
              invalidateQueries([staticsKey]);
            }}
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
          />
        </div>
      )}
    </S.Wrap>
  );
}

export default StatisticsStatus;
