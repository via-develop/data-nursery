import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

const S = {
  Wrap: styled.div`
    height: 687px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 37px;
  `,
};

function GraphTodayProductionNoWork() {
  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    const graphCtx = graphRef.current?.getContext("2d");

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "line",
        data: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // 오늘 날짜의 일수를 라벨로 사용
        },
        options: {
          layout: {
            padding: {
              left: 20,
              right: 20,
              top: 50,
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
                text: "시",
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
                text: "개 (단위 : 천)",
              },
              beginAtZero: true,
              ticks: {
                stepSize: 10,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
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
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphTodayProductionNoWork;
