import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";
import theme from "@src/styles/theme";
import { NumberFormatting } from "@utils/Formatting";

const S = {
  Wrap: styled.div`
    height: 200px;
    width: 100%;
  `,
};

function StatisticsDayChart({ dailyOutput, selectDate, isOutput }) {
  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    if (!dailyOutput) {
      return;
    }

    // X축 라벨 및 데이터 생성
    const dayLabel = []; // x축 라벨
    const outputArray = []; // 데이터

    const date = new Date(selectDate.year, selectDate.month - 1, 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

    for (let day = 1; day <= lastDay; day++) {
      dayLabel.push(day);

      if (isOutput) {
        if (dailyOutput.filter((output) => output.day === day).length !== 0) {
          outputArray.push(dailyOutput.filter((output) => output.day === day)[0].output);
        } else {
          outputArray.push(0);
        }
      }
    }

    const graphCtx = graphRef.current?.getContext("2d");

    const annotationline = {
      beforeDraw: (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const ctx = chart.ctx;
          ctx.save();
          // const activePoint = chart.tooltip._active[0];
          ctx.beginPath();
          ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
          ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
          ctx.lineWidth = 1;
          ctx.setLineDash([2, 2]); // 세로선 점선 표시
          ctx.strokeStyle = theme.basic.grey30; // 세로 점선 색상
          ctx.stroke();
          ctx.restore();
        }
      },
    };

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "line",
        data: {
          labels: dayLabel,
          datasets: [
            {
              data: outputArray,
              // label: (day) => `${day}일`,
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 4,
              borderWidth: 2.5,
              borderColor: "#FB97A3",
              pointBackgroundColor: "#FB97A3",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 3,
              pointHoverBackgroundColor: "#fff",
            },
          ],
        },
        plugins: [annotationline],
        options: {
          layout: {
            padding: {
              left: 0,
              right: 0,
            },
          },
          maintainAspectRatio: false, //그래프 크기를 조절하기 위해서
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                tickLength: 9,
                tickColor: "#ffffff",
              },
              title: {
                display: true,
                align: "end",
                text: "일",
                color: theme.basic.grey40,
              },
              ticks: {
                align: "start",
                stepSize: 10,
                color: theme.basic.grey40,
                style: "normal",
              },
            },
            y: {
              grid: {
                drawOnChartArea: false,
                tickLength: 9,
                tickColor: "#ffffff",
              },
              ticks: {
                stepSize: 10,
                color: theme.basic.grey40,
              },
              min: 0,
            },
          },
          interaction: {
            intersect: false, // 툴팁 데이터위에 hover했을때만 나오게 하는것 false
          },
          plugins: {
            backgroundBar: {
              barColor: "#F7F7FA", // 배경색상
              borderRadius: 4,
            },
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: theme.basic.grey60,
              borderRadius: 8,
              padding: (6, 16),
              xAlign: "center",
              yAlign: "bottom",
              displayColors: false,
              titleAlign: "center",
              bodyAlign: "center",
              titleColor: theme.basic.grey30,
              bodyColor: "#fff",
              callbacks: {
                title: function (context) {
                  return context[0].label + "일";
                },
                beforeBody: function (context) {
                  return NumberFormatting(context[0].formattedValue) + "개";
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
  }, [dailyOutput]);

  return (
    <S.Wrap>
      <canvas width="100%" height={"100%"} ref={graphRef} />
    </S.Wrap>
  );
}

export default StatisticsDayChart;
