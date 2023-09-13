import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

import usePlanterCrop from "@src/hooks/queries/planter/usePlanterCrop";

const S = {
  Wrap: styled.div`
    height: 340px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 37px;
  `,
  Legend: styled.div`
    text-align: right;
    padding-right: 15px;

    p {
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: "#737F8F";
    }
  `,
};

function GraphCropProductionMonth() {
  const { data: planterCrops } = usePlanterCrop({
    queryType: "day",
    successFn: () => {},
    errorFn: (err) => {
      console.log("!!err", err);
    },
  });

  console.log("작물별 생산량 월별", planterCrops);

  const graphRef = useRef(null);
  let graphInstance = null;

  const data1 = [];
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    data1.push(randomNumber);
  }
  const data2 = [];
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    data2.push(randomNumber);
  }
  const data3 = [];
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    data3.push(randomNumber);
  }
  const data4 = [];
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    data4.push(randomNumber);
  }
  const data5 = [];
  for (let i = 0; i < 12; i++) {
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    data5.push(randomNumber);
  }

  useEffect(() => {
    const graphCtx = graphRef.current?.getContext("2d");

    const annotationline = {
      // id: "annotationline",
      beforeDraw: (chart) => {
        if (chart.tooltip._active && chart.tooltip._active.length) {
          const ctx = chart.ctx;
          ctx.save();
          // const activePoint = chart.tooltip._active[0];
          ctx.beginPath();
          ctx.moveTo(chart.tooltip._active[0].element.x, chart.chartArea.top);
          ctx.lineTo(chart.tooltip._active[0].element.x, chart.chartArea.bottom);
          ctx.lineWidth = 1.5;
          ctx.setLineDash([2, 2]); // 세로선 점선 표시
          ctx.strokeStyle = "#C2D6E1"; // 세로 점선 색상
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
          labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          datasets: [
            {
              data: data1,
              label: "토마토",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#FB97A3",
              pointBackgroundColor: "#FB97A3",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
            {
              data: data2,
              label: "수박",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#9993FC",
              pointBackgroundColor: "#9993FC",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
            {
              data: data3,
              label: "고추",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#1FC9C1",
              pointBackgroundColor: "#1FC9C1",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
            {
              data: data4,
              label: "오이",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#FBE367",
              pointBackgroundColor: "#FBE367",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
            {
              data: data5,
              label: "상추",
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
              borderWidth: 3,
              borderColor: "#67FB90",
              pointBackgroundColor: "#67FB90",
              pointBorderColor: "#4F5B6C",
              pointRadius: 0,
              pointHoverBorderWidth: 5,
              pointHoverBackgroundColor: "#fff",
            },
          ],
        },
        plugins: [annotationline],
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
                text: "월",
              },
            },
            y: {
              grid: {
                drawOnChartArea: false,
              },
              position: "left",
              title: {
                display: true,
                align: "end",
                text: "개 (단위 : 만)",
              },
              ticks: {
                stepSize: 10,
              },
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
                  return context[0].dataset.label;
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
  }, []);

  return (
    <S.Wrap>
      <S.Legend>
        <p>범례</p>
      </S.Legend>
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphCropProductionMonth;
