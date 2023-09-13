import React, { useCallback, useState } from "react";
import styled, { css } from "styled-components";
import { useRouter } from "next/router";
import Image from "next/image";

import useStatistics from "@hooks/queries/planter/useStatistics";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import MainLayout from "@components/layout/MainLayout";
import DefaultYearMonthSelect from "@components/common/calendar/DefaultYearMonthSelect";
import DefaultYearMonthList from "@components/common/calendar/DefaultYearMonthList";
import StatisticsDayChart from "@components/statistics/StatisticsDayChart";
import StatisticsMonthChart from "@components/statistics/StatisticsMonthChart";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import theme from "@src/styles/theme";
import { ImagePathCheck, NumberFormatting } from "@utils/Formatting";
import PopularCropKindIcon from "@images/common/popular-crop-kind.svg";
import NoneIcon from "@images/dashboard/none-icon.svg";
import { statisticsKey } from "@utils/query-keys/PlanterQueryKeys";

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
    padding: 24px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 76px;
    background-color: ${({ theme }) => theme.basic.deepBlue};
    position: sticky;
  `,
  ContentWrap: styled.div`
    padding: 32px 24px;
    height: calc(100% - 76px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background-color: ${({ theme }) => theme.basic.whiteGrey};
  `,
  SelectedDateWrap: styled.div`
    width: fit-content;
    height: 40px;
    background-color: ${({ theme }) => theme.basic.grey20};
    padding: 8px;
    border-radius: 8px;

    p {
      ${({ theme }) => theme.textStyle.h6Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  TotalValueWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

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

    .tray-value {
      color: ${({ theme }) => theme.basic.grey60};
    }

    .suffix-text {
      ${({ theme }) => theme.textStyle.h5Regular}
      color: ${({ theme }) => theme.basic.grey40};
    }

    .slash-text {
      color: #c6c6c6;
    }
  `,
  MonthOutputWrap: styled.div`
    width: 100%;
    margin-top: 24px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 24px 24px 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    filter: drop-shadow(4px 4px 16px rgba(89, 93, 107, 0.1));

    .output-title {
      ${({ theme }) => theme.textStyle.h5Bold}
    }

    .y-tick-text {
      ${({ theme }) => theme.textStyle.h9Regular}
      color: ${({ theme }) => theme.basic.grey40};
    }

    ${(props) =>
      props.isOutput
        ? css`
            .output-title {
              color: ${({ theme }) => theme.basic.grey60};
            }
          `
        : css`
            .output-title {
              color: ${({ theme }) => theme.basic.grey30};
            }
          `}
  `,
  PopularCropKindIconWrap: styled.div`
    width: 100%;
    margin: 24px 0px 12px 0px;
    display: flex;
    align-items: center;
    gap: 12px;

    .popular-crop-kind-text {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
  PopularCropKindContent: styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: ${({ theme }) => theme.basic.grey60};
      width: 100%;
      text-align: left !important;
    }

    .index-text {
      width: 25px;
      ${({ theme }) => theme.textStyle.h5Bold}
    }

    .info-wrap {
      width: calc(100% - 33px);
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .text-wrap {
      width: calc(100% - 80px);
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 6px;
    }

    .count-text-wrap {
      display: flex;
      align-items: flex-end;
      gap: 3px;
      max-width: 100%;
    }

    .crop-kind-text {
      ${({ theme }) => theme.textStyle.h5Regular}
    }

    .count-text {
      ${({ theme }) => theme.textStyle.h3Bold}
      flex:1;
    }

    .suffix-text {
      color: ${({ theme }) => theme.basic.grey40};
      width: fit-content;
    }
  `,
  CropImage: styled.div`
    width: 56px;
    height: 56px;
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
  NoDataText: styled.p`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff50;
    top: 0;
    left: 0;

    ${({ theme }) => theme.textStyle.h6Bold}
    color: ${({ theme }) => theme.basic.grey60};
  `,
};

function StatisticsPage() {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();

  // 선택한 년도, 월
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // 년도, 월 Select open 여부
  const [yearMonthOpen, setYearMontOpen] = useState({
    year: false,
    month: false,
  });

  // 날짜 변경
  const handleDateChange = useCallback(
    (name, value) => {
      setDate((prev) => ({
        ...prev,
        [name]: value,
      }));
      invalidateQueries([statisticsKey]);
    },
    [date],
  );

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

  // 통계현황 목록 API
  const { data: statisticsInfo } = useStatistics({
    year: date.year,
    month: date.month,
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  return (
    <MainLayout
      pageName={"통계현황"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor={theme.basic.deepBlue}>
      <S.Wrap>
        <S.DateSelectWrap>
          <DefaultYearMonthSelect date={date} yearMonthOpen={yearMonthOpen} handleYearMonthOpen={handleYearMonthOpen} />
        </S.DateSelectWrap>
        <S.ContentWrap>
          <S.SelectedDateWrap>
            {date.month === 0 && <p>{date.year}년 생산량</p>}
            {date.month !== 0 && <p>{date.month}월 생산량</p>}
          </S.SelectedDateWrap>
          <S.TotalValueWrap>
            <div className="row-layout">
              <p className="seed-quantity-value">{NumberFormatting(statisticsInfo?.total_output)}</p>
              <p className="suffix-text">개</p>
            </div>
            <p className="suffix-text slash-text">/</p>
            <div className="row-layout">
              <p className="seed-quantity-value tray-value">{NumberFormatting(statisticsInfo?.working_times)}</p>
              <p className="suffix-text">회</p>
            </div>
          </S.TotalValueWrap>
          <S.MonthOutputWrap isOutput={statisticsInfo?.total_output !== 0}>
            {date.month === 0 && <p className="output-title">년간 생산량</p>}
            {date.month !== 0 && <p className="output-title">월간 생산량</p>}
            <p className="y-tick-text">개</p>
            {date.month === 0 && (
              <StatisticsMonthChart
                dailyOutput={statisticsInfo?.daily_output}
                isOutput={statisticsInfo?.total_output !== 0}
              />
            )}
            {date.month !== 0 && (
              <StatisticsDayChart
                dailyOutput={statisticsInfo?.daily_output}
                selectDate={date}
                isOutput={statisticsInfo?.total_output !== 0}
              />
            )}
            {statisticsInfo?.total_output === 0 && <S.NoDataText>완료된 작업이 없습니다</S.NoDataText>}
          </S.MonthOutputWrap>
          {statisticsInfo?.total_output !== 0 && (
            <>
              <S.PopularCropKindIconWrap>
                <PopularCropKindIcon />
                <p className="popular-crop-kind-text">인기품종</p>
              </S.PopularCropKindIconWrap>
              {statisticsInfo?.popular_crop.map((crop, index) => {
                return (
                  <S.PopularCropKindContent key={`crop${index}`}>
                    <p className="index-text">{index + 1}</p>
                    <div className="info-wrap">
                      <S.CropImage isCropImage={!!crop.image}>
                        {!!crop.image ? (
                          <Image src={ImagePathCheck(crop.image)} layout="fill" alt="crop image" />
                        ) : (
                          <NoneIcon width={30} height={30} fill={"#BCBCD9"} />
                        )}
                      </S.CropImage>
                      <div className="text-wrap">
                        <p className="crop-kind-text">{crop.name}</p>
                        <div className="count-text-wrap">
                          <p className="count-text">{NumberFormatting(crop.output)}</p>
                          <p className="crop-kind-text suffix-text">개</p>
                        </div>
                      </div>
                    </div>
                  </S.PopularCropKindContent>
                );
              }, [])}
            </>
          )}
        </S.ContentWrap>
        <DefaultYearMonthList
          isStatistics={true}
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
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default StatisticsPage;
