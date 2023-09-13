import React from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

import HistoryIcon from "@images/dashboard/icon-history.svg";
import ChartIcon from "@images/dashboard/icon-chart.svg";

const S = {
  BottomWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    width: 100%;
    height: 88px;
    bottom: 0px;

    .bottom-box {
      width: 30px;
      height: 25px;
      background-color: #ffffff;

      position: absolute;
      bottom: 0px;
      z-index: 98;
      cursor: pointer;
    }

    .right-top-radius {
      border-top-right-radius: 65px;
      padding-right: 15px;
      left: 0px;

      .bottom-box {
        right: -30px;
      }
    }

    .left-top-radius {
      border-top-left-radius: 65px;
      padding-left: 15px;
      right: 0px;

      .bottom-box {
        left: -30px;
      }
    }
  `,
  BottomBarContent: styled.div`
    width: calc(50% - 30px);
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: absolute;
    bottom: 0px;
    background-color: #ffffff;
    filter: drop-shadow(0px -4px 10px rgba(165, 166, 168, 0.16));
    cursor: pointer;

    p {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey60};
    }
  `,
  NewWorkButtonWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #5899fb;
    box-shadow: 0px 4px 6px 0px rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    width: 98px;
    height: 98px;

    position: absolute;
    bottom: 16px;
    left: calc(50% - 49px);
    z-index: 99;
    cursor: pointer;
    padding: 8px;
  `,
  NewWorkButton: styled.div`
    width: 100%;
    height: 100%;

    background: linear-gradient(151deg, #5192f3 0%, #5899fb 41.67%);
    border-radius: 50%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

    p {
      ${({ theme }) => theme.textStyle.h5Bold}
      color: #ffffff;
    }

    .plus-icon {
      font-size: 35.714px;
      font-weight: 400;
      line-height: 42.857px;
      color: #ffffff50;
    }
  `,
};

function BottomBar() {
  const router = useRouter();

  return (
    <S.BottomWrap>
      <S.BottomBarContent
        className="right-top-radius"
        onClick={() => {
          router.push("/work/history");
        }}>
        <div
          className="bottom-box"
          onClick={(e) => {
            router.push("/work/history");
            e.stopPropagation();
          }}
        />
        <HistoryIcon />
        <p>이력조회</p>
      </S.BottomBarContent>
      <S.NewWorkButtonWrap
        onClick={() => {
          router.push("/work/registration");
        }}>
        <S.NewWorkButton>
          <p className="plus-icon">+</p>
          <p>새작업</p>
        </S.NewWorkButton>
      </S.NewWorkButtonWrap>

      <S.BottomBarContent
        className="left-top-radius"
        onClick={() => {
          router.push("/statistics");
        }}>
        <div
          className="bottom-box"
          onClick={(e) => {
            router.push("/statistics");
            e.stopPropagation();
          }}
        />
        <ChartIcon />
        <p>통계보기</p>
      </S.BottomBarContent>
    </S.BottomWrap>
  );
}

export default BottomBar;
