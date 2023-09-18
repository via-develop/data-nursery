import React, { useState } from "react";
import styled from "styled-components";
import ScrollContainer from "react-indiana-drag-scroll";
import Image from "next/image";
import axios from "axios";

import useDashBoard from "@hooks/queries/planter/useDashBoard";
import { getUserInfoUrl } from "@apis/authAPIs";

import MainLayout from "@components/layout/MainLayout";
import WorkTab from "@components/dashboard/WorkTab";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import TodayOutputIcon from "@images/dashboard/icon-output.svg";
import UseTimeIcon from "@images/dashboard/icon-time.svg";
import { NumberFormatting, HourFormatting, MinFormatting } from "@utils/Formatting";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    padding-top: 35px;
    overflow-y: auto;

    p {
      ${({ theme }) => theme.textStyle.h1Bold}
    }
  `,
  ScrollWrap: styled.div`
    width: 100%;
    height: 135px;
    margin-bottom: 5px;

    .scroll-container {
      height: 135px;
      display: flex;
      overflow-x: auto;
      gap: 16px;
      padding: 0px 24px;
    }

    .today-output {
      padding: 24px;
      background-color: ${({ theme }) => theme.basic.deepBlue};

      .row-layout p {
        ${({ theme }) => theme.textStyle.h7Bold}
        color: ${({ theme }) => theme.basic.grey30};
      }

      .data-wrap .bold-text {
        font-size: 28px;
        font-weight: 700;
        line-height: 28px;
      }
    }

    .best-kind {
      background-color: #5899fb;

      .row-layout p {
        color: ${({ theme }) => theme.mobile.sky};

        span {
          color: ${({ theme }) => theme.mobile.sky};
          ${({ theme }) => theme.textStyle.h7Bold}
        }
      }
    }

    .use-time {
      background-color: ${({ theme }) => theme.mobile.secondary2};

      .row-layout p {
        color: ${({ theme }) => theme.mobile.dashboardFont};
      }
    }
  `,
  CardWrap: styled.div`
    min-width: 260px;
    max-width: 260px;
    height: 116px;
    padding: 24px 32px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(55, 80, 171, 0.3);

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
      color: #ffffff;
    }

    .row-layout {
      display: flex;
      align-items: center;
      gap: 8px;

      p {
        ${({ theme }) => theme.textStyle.h6Bold}
      }
    }

    .data-wrap {
      display: flex;
      align-items: flex-end;
      gap: 6px;
      width: 100%;

      .bold-text {
        ${({ theme }) => theme.textStyle.h1Bold}
      }

      .suffix-text {
        ${({ theme }) => theme.textStyle.h5Regular}
      }
    }

    .time-wrap {
      display: flex;
      align-items: flex-end;
      gap: 16px;

      .data-wrap {
        gap: 2px;
      }
    }
  `,
  WorkWrap: styled.div`
    padding: 0px 24px;
    width: 100%;
    height: 100%;

    .no-work {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 12px;
      align-items: center;
      justify-content: center;

      p {
        ${({ theme }) => theme.textStyle.h5Bold}
        color: ${({ theme }) => theme.basic.grey50};
      }
    }
  `,
};

function MainPage() {
  const [loading, setLoading] = useState(false);

  // 대시보드 API (오늘의 생산량, BEST품종, 사용시간)
  const { data: dashBoardInfo, isLoading: dashBoardLoading } = useDashBoard({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  return (
    <MainLayout pageName={"main"} isLoading={dashBoardLoading || loading}>
      <S.Wrap>
        <S.ScrollWrap>
          <ScrollContainer className="scroll-container" horizontal={true}>
            <S.CardWrap className="today-output">
              <div className="row-layout">
                <TodayOutputIcon />
                <p>오늘의 생산량</p>
              </div>
              <div className="data-wrap">
                <p className="bold-text">
                  {NumberFormatting(
                    !!dashBoardInfo?.today_total_seed_quantity ? dashBoardInfo?.today_total_seed_quantity : 0,
                  )}
                </p>
                <p className="suffix-text">개</p>
              </div>
            </S.CardWrap>
            <S.CardWrap className="best-kind">
              <div className="row-layout">
                <Image src={"/images/dashboard/icon-best.png"} width={24} height={24} alt="best kind image" />
                <p>
                  BEST품종 {!!dashBoardInfo?.today_best_crop_kind && "- "}
                  {!!dashBoardInfo?.today_best_crop_kind && <span>{dashBoardInfo.today_best_crop_kind.crop_kind}</span>}
                </p>
              </div>
              <div className="data-wrap">
                <p className="bold-text">
                  {NumberFormatting(
                    !!dashBoardInfo?.today_best_crop_kind ? dashBoardInfo?.today_best_crop_kind.total_seed_quantity : 0,
                  )}
                </p>
                <p className="suffix-text">개</p>
              </div>
            </S.CardWrap>
            <S.CardWrap className="use-time">
              <div className="row-layout">
                <UseTimeIcon />
                <p>
                  사용시간 -{" "}
                  {!!dashBoardInfo?.today_planter_usage.working_times
                    ? dashBoardInfo?.today_planter_usage.working_times
                    : 0}
                  회
                </p>
              </div>
              <div className="time-wrap">
                <div className="data-wrap">
                  <p className="bold-text">
                    {!!dashBoardInfo?.today_planter_usage.time
                      ? HourFormatting(dashBoardInfo?.today_planter_usage.time)
                      : 0}
                  </p>
                  <p className="suffix-text">시간</p>
                </div>
                <div className="data-wrap">
                  <p className="bold-text">
                    {!!dashBoardInfo?.today_planter_usage.time
                      ? MinFormatting(dashBoardInfo?.today_planter_usage.time)
                      : 0}
                  </p>
                  <p className="suffix-text">분</p>
                </div>
              </div>
            </S.CardWrap>
          </ScrollContainer>
        </S.ScrollWrap>
        <S.WorkWrap>
          <WorkTab setLoading={setLoading} />
        </S.WorkWrap>
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

export default MainPage;
