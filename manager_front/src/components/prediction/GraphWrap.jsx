import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

import BarIcon from "@images/dashboard/icon-bar.svg";

const S = {
  Wrap: styled.div`
    background-color: ${({ theme }) => theme.blackWhite.white};

    padding: 56px 40px 40px 40px;
  `,
  TitleWrap: styled.div`
    display: flex;
    align-items: center;
    gap: 16px;

    p {
      ${({ theme }) => theme.textStyle.h4Bold}
    }
  `,
  GraphCanvas: styled.div`
    margin-top: 30px;
    height: 360px;
    width: 100%;
    padding: 64px 0px 24px 0px;
    border-radius: 8px;
    border: 1px solid #c2d6e1;
  `,
};

function GraphWrap({ planterChoose, sowingData, dateRange }) {
  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    if (!sowingData && !planterChoose) {
      return;
    }

    const dataArray = sowingData?.crop_output?.map((item) => item?.output); // output 데이터 배열

    const dayLabel = []; //날짜 데이터 구하기 (시작날부터 종료날까지 날짜값 배열)
    const currentDate = new Date(dateRange.startDate);
    while (currentDate <= dateRange.endDate) {
      dayLabel.push(currentDate.getDate());
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const graphCtx = graphRef.current?.getContext("2d");

    const backgroundBar = {
      id: "backgroundBar",
      beforeDatasetsDraw(chart, args, pluginOptions) {
        const {
          data,
          ctx,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;

        ctx.save();
        const segment = width / data.labels.length;
        const barWidth = segment * data.datasets[0].barPercentage * data.datasets[0].categoryPercentage;

        ctx.fillStyle = pluginOptions.barColor;
        for (let i = 0; i < data.labels.length; i++) {
          ctx.fillRect(x.getPixelForValue(i) - barWidth / 2, top, barWidth, height);
        }
      },
    };

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "bar",
        data: {
          labels: dayLabel,
          datasets: [
            {
              data: dataArray,
              backgroundColor: planterChoose.crop_color,
              hoverBackgroundColor: planterChoose.crop_color,
              borderRadius: 4,
              borderWidth: 1,
              barPercentage: 1,
              categoryPercentage: 0.6,
            },
          ],
        },
        plugins: [backgroundBar],
        options: {
          layout: {
            padding: {
              left: 20,
              right: 20,
            },
          },
          maintainAspectRatio: false, //그래프 크기를 조절하기 위해서
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                align: "end",
                text: "일",
              },
              ticks: {
                stepSize: 5,
              },
            },
            y: {
              grid: {
                drawOnChartArea: false,
              },
              position: "left",
              // title: {
              //   display: true,
              //   align: "end",
              //   text: "개 (단위 : 만)",
              // },
              // ticks: {
              //   stepSize: 10,
              // },
            },
          },
          interaction: {
            intersect: false, // 툴팁 데이터위에 hover했을때만 나오게 하는것 false
          },
          plugins: {
            backgroundBar: {
              barColor: "#F7F7FA", // 그래프 뒤에 배경색상
              borderRadius: 4,
            },
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: "#4F5B6C",
              borderRadius: 8,
              padding: 16,
              xAlign: "center",
              yAlign: "bottom",
              displayColors: false,
              titleAlign: "center",
              bodyAlign: "center",
              titleColor: "#C2D6E1",
              bodyColor: "#fff",
              callbacks: {
                title: function (context) {
                  return context[0].label + "일";
                },
                beforeBody: function (context) {
                  return context[0].formattedValue + "개";
                },
                label: function (context) {
                  return "";
                },
              },
            },
          },
        },
      });
    };

    const destroyChart = () => {
      graphInstance?.destroy();
      graphInstance = null;
    };

    destroyChart(); // 기존 차트 파괴
    graphChart();

    return () => {
      destroyChart(); // 컴포넌트가 unmount될 때 차트 파괴
    };
  }, [dateRange, planterChoose, sowingData]);

  return (
    <S.Wrap>
      <S.TitleWrap>
        <BarIcon width={5} height={28} />
        <p>{planterChoose.crop_name} 파종량 (단위 : 개)</p>
      </S.TitleWrap>
      <S.GraphCanvas>
        <canvas ref={graphRef} />
      </S.GraphCanvas>
    </S.Wrap>
  );
}

export default GraphWrap;
