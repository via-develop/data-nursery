import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

const S = {
  Wrap: styled.div`
    height: 360px;
    width: 100%;
  `,
};

function GraphTotalProduction() {
  const graphRef = useRef(null);
  let graphInstance = null;

  const monthDay = [];
  for (let i = 1; i <= 30; i++) {
    monthDay.push(i);
  }
  useEffect(() => {
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
          labels: monthDay,
          datasets: [
            {
              data: [12, 19, 3, 10, 2, 3, 9, 1, 3, 3, 9, 10, 10, 10, 15],
              backgroundColor: (context) => {
                const index = context.dataIndex;
                if (index > 0 && index % 5 === 4) {
                  return "#B298FD"; // 5의 배수이면서 0이 아닐 때
                }
                return "#C8B4F7";
              },
              hoverBackgroundColor: (context) => {
                const index = context.dataIndex;
                if (index > 0 && index % 5 === 4) {
                  return "#B298FD"; // 5의 배수이면서 0이 아닐 때
                }
                return "#C8B4F7";
              },
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
                  return context[0].label + "월";
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
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphTotalProduction;
