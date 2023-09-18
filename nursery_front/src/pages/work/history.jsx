import React, { useCallback, useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import axios from "axios";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useWorkHistoryList from "@hooks/queries/planter/useWorkHistoryList";
import userLogout from "@utils/userLogout";
import { getUserInfoUrl } from "@apis/authAPIs";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import MainLayout from "@components/layout/MainLayout";
import DefaultYearMonthSelect from "@components/common/calendar/DefaultYearMonthSelect";
import DefaultYearMonthList from "@components/common/calendar/DefaultYearMonthList";
import DefaultHorizontalCalendar from "@components/common/calendar/DefaultHorizontalCalendar";
import LottieView from "@components/common/LottiePlayer";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";
import { DateDotFormatting, DateKoreanFormatting, ImagePathCheck, NumberFormatting } from "@utils/Formatting";
import NoneIcon from "@images/dashboard/none-icon.svg";
import BoxIcon from "@images/dashboard/icon-box.svg";
import { workHistoryKey } from "@utils/query-keys/PlanterQueryKeys";
import LottieLoading from "@images/common/loading.json";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
  `,
  DateSelectWrap: styled.div`
    padding: 24px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 166px;
    background-color: ${({ theme }) => theme.basic.deepBlue};
    position: sticky;

    .select-wrap-padding {
      padding: 16px 0px;
    }

    ${(props) =>
      props.isScroll &&
      css`
        filter: drop-shadow(0px 4px 10px rgba(165, 166, 168, 0.16));
      `}
  `,
  ContentWrap: styled.div`
    padding: 32px 24px;
    height: calc(100% - 166px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${({ theme }) => theme.basic.whiteGrey};

    .total-seed-quantity-text {
      margin: 20px 0px 10px 0px;
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.deepBlue};
      flex-shrink: 0;
    }

    .no-work-history {
      font-size: 16px;
      line-height: 20px; /* 125% */
      letter-spacing: -0.32px;
      color: ${({ theme }) => theme.basic.grey50};
      margin-top: 27px;
    }
  `,
  SelectedDateWrap: styled.div`
    width: fit-content;
    height: 34px;
    background-color: ${({ theme }) => theme.basic.grey20};
    padding: 8px;
    border-radius: 8px;

    p {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  TotalSeedQuantityValueWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;

    .row-layout {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .seed-quantity-value {
      ${({ theme }) => theme.textStyle.h1BoldThin}
      color: ${({ theme }) => theme.mobile.secondary2};
      line-height: 36px;
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.deepBlue};
    }

    .border-bottom {
      width: 100%;
      height: 4px;
      border-radius: 2px;
      background-color: ${({ theme }) => theme.mobile.secondary2};
    }
  `,
  WorkHistoryTextWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 40px;
    width: 100%;

    .work-history-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }

    .work-history-suffix-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .work-history-count-wrap {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  `,
  WorkHistoryListWrap: styled.div`
    width: 100%;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  WorkHistoryContent: styled.div`
    width: 100%;
    height: 238px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    cursor: pointer;

    .divider {
      width: 100%;
      height: 1px;
      background-color: ${({ theme }) => theme.basic.recOutline};
      margin: 16px 0px;
    }
  `,
  WorkInfo: styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 24px;

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
      width: calc(100% - 82px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .crop-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      text-align: left;
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
      margin-top: 10px;
      align-items: center;
    }

    .seed-quantity-text {
      color: ${({ theme }) => theme.basic.grey50};
      flex: 1;
    }
  `,
  CropImage: styled.div`
    width: 58px;
    height: 58px;
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
  DateWrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .date-row-layout {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .category-box {
      width: 58px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;

      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.recOutline};

      p {
        ${({ theme }) => theme.textStyle.h7Regular}
        color: ${({ theme }) => theme.basic.deepBlue};
      }
    }

    .date-text {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
};

function WorkHistoryPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();
  const invalidateQueries = useInvalidateQueries();

  // 스크롤 유무 판단하기 위함
  const [isScroll, setIsScroll] = useState(false);

  // inView : 요소가 뷰포트에 진입했는지 여부
  const { ref, inView, entry } = useInView({
    threshold: 0, // 요소가 얼마나 노출되었을때 inView를 true로 변경할지 (0~1 사이의 값)
  });

  const [koreanDate, setKoreanDate] = useState(null);
  const [workHistoryListPage, setWorkHistoryListPage] = useState(1);
  const [workHistoryList, setWorkHistoryList] = useState([]);

  // 선택한 년도, 월
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  // 년도, 월 Select open 여부
  const [yearMonthOpen, setYearMontOpen] = useState({
    year: false,
    month: false,
  });

  useEffect(() => {
    setKoreanDate(new Date(date.year, date.month - 1, date.day));
  }, []);

  useEffect(() => {
    if (inView) {
      pageChange();
    }
  }, [inView]);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 작업이력 목록 API
  const { data: workHistoryListData, isLoading: workingHistoryListLoading } = useWorkHistoryList({
    serialNumber: userInfo?.planter.serial_number,
    year: date.year,
    month: date.month,
    date: date.day,
    page: workHistoryListPage,
    successFn: (res) => {
      setWorkHistoryList((prev) => [...prev, ...res.planter_works]);
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  // 스크롤 감지
  const contentScroll = useCallback((e) => {
    if (e.target.scrollTop > 0) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  }, []);

  // 페이지 변경
  const pageChange = useCallback(() => {
    if (workHistoryList.length !== 0 && workHistoryListData?.total > workHistoryList.length) {
      setWorkHistoryListPage(workHistoryListPage + 1);
    }
  }, [workHistoryListData, workHistoryListPage, workHistoryList]);

  // 년도, 월 오픈 변경
  const handleYearMonthOpen = useCallback(
    (name, value) => {
      setYearMontOpen((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [yearMonthOpen],
  );

  // 날짜 변경
  const handleDateChange = useCallback(
    (name, value) => {
      setDate((prev) => ({
        ...prev,
        [name]: value,
      }));
      setWorkHistoryList([]);
      invalidateQueries([workHistoryKey]);
      setWorkHistoryListPage(1);
    },
    [date],
  );

  return (
    <MainLayout
      pageName={"작업이력"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor={theme.basic.deepBlue}
      buttonSetting={null}>
      <S.Wrap>
        <S.DateSelectWrap isScroll={isScroll}>
          <div className="select-wrap-padding">
            <DefaultYearMonthSelect
              date={date}
              yearMonthOpen={yearMonthOpen}
              handleYearMonthOpen={handleYearMonthOpen}
            />
          </div>
          <DefaultHorizontalCalendar date={date} handleDateChange={handleDateChange} />
        </S.DateSelectWrap>
        <S.ContentWrap onScroll={contentScroll}>
          {workingHistoryListLoading ? (
            <div className="loading-wrap">
              <LottieView
                options={{
                  animationData: LottieLoading,
                }}
                style={{
                  width: "80%",
                }}
              />
            </div>
          ) : (
            <>
              <S.SelectedDateWrap>
                {/* <p>{DateKoreanFormatting(new Date(date.year, date.month - 1, date.day))}</p> */}
                <p>{DateKoreanFormatting(koreanDate)}</p>
              </S.SelectedDateWrap>
              <p className="total-seed-quantity-text">총파종량</p>
              <S.TotalSeedQuantityValueWrap>
                <div className="row-layout">
                  <p className="seed-quantity-value">{NumberFormatting(workHistoryListData?.total_seed_quantity)}</p>
                  <p className="suffix-text">개</p>
                </div>
                {!!workHistoryListData && workHistoryListData?.total !== 0 && <div className="border-bottom" />}
              </S.TotalSeedQuantityValueWrap>
              {!!workHistoryListData && workHistoryListData?.total !== 0 ? (
                <>
                  <S.WorkHistoryTextWrap>
                    <p className="work-history-text">작업내역</p>
                    <div className="work-history-count-wrap">
                      <p className="work-history-suffix-text">작업수 : 총</p>
                      <p className="work-history-text">{NumberFormatting(workHistoryListData?.total)}</p>
                      <p className="work-history-suffix-text">건</p>
                    </div>
                  </S.WorkHistoryTextWrap>
                  <S.WorkHistoryListWrap>
                    {workHistoryList.map((work) => {
                      return (
                        <S.WorkHistoryContent
                          key={`work${work.id}`}
                          onClick={() => {
                            router.push(`/work/${work.id}`);
                          }}>
                          <S.WorkInfo>
                            <S.CropImage isCropImage={!!work.crop_image}>
                              {!!work.crop_image ? (
                                <Image src={ImagePathCheck(work.crop_image)} layout="fill" alt="crop image" />
                              ) : (
                                <NoneIcon width={25} height={25} fill={"#BCBCD9"} />
                              )}
                            </S.CropImage>
                            <div className="text-wrap">
                              <p className="crop-text">
                                {work.crop_name} #{work.crop_kind}
                              </p>
                              <div className="count-text-wrap">
                                <p className="count-text">{NumberFormatting(work.seed_quantity)}</p>
                                <p className="suffix-text">개</p>
                              </div>
                              <div className="count-text-wrap seed-quantity-wrap">
                                <BoxIcon />
                                <p className="suffix-text seed-quantity-text">{NumberFormatting(work.tray_total)} 공</p>
                              </div>
                            </div>
                          </S.WorkInfo>
                          <div className="divider" />
                          <S.DateWrap>
                            <div className="date-row-layout">
                              <div className="category-box">
                                <p>파종일</p>
                              </div>
                              <p className="date-text">{DateDotFormatting(work.sowing_date)}</p>
                            </div>
                            <div className="date-row-layout">
                              <div className="category-box">
                                <p>출하일</p>
                              </div>
                              <p className="date-text">{DateDotFormatting(work.deadline)}</p>
                            </div>
                          </S.DateWrap>
                        </S.WorkHistoryContent>
                      );
                    })}
                    <div ref={ref} />
                  </S.WorkHistoryListWrap>
                </>
              ) : (
                <p className="no-work-history">완료된 작업이 없습니다</p>
              )}
            </>
          )}
        </S.ContentWrap>
        <DefaultYearMonthList
          date={date}
          yearMonthOpen={yearMonthOpen}
          handleDateChange={handleDateChange}
          handleYearMonthOpen={handleYearMonthOpen}
        />
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication(async (context) => {
  const userInfoRes = await axios.get(getUserInfoUrl(true), {
    headers: { Cookie: context.req.headers.cookie },
  });

  // 파종기 미등록 시 파종기 등록페이지로 이동
  if (!userInfoRes.data.planter.is_register) {
    return {
      redirect: {
        destination: "/QR-scanner",
        statusCode: 302,
      },
    };
  } else {
    return { props: {} };
  }
});

export default WorkHistoryPage;
