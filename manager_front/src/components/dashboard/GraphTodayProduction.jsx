import React, { useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

// import "chartjs-adapter-date-fns";
import "chartjs-adapter-moment";

const S = {
  Wrap: styled.div`
    height: 737px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 37px;
  `,
};

function GraphTodayProduction({ planterToday }) {
  useEffect(() => {
    if (!planterToday) {
      return;
    }
  }, [planterToday]);

  const graphRef = useRef(null);
  let graphInstance = null;

  const monthDay = [];
  for (let i = 1; i <= 30; i++) {
    monthDay.push(i);
  }

  // 생산량 배열
  const workingGraphArr = [];
  for (const item of planterToday) {
    workingGraphArr.push(item.output);
  }

  // 생산량 시간 배열
  const timeGraphArr = [];
  for (const item of planterToday) {
    timeGraphArr.push(item.output_updated_at);
  }

  // 생산량 + 시간 배열
  const workingGraphTimeArr = useMemo(() => {
    const data = [];
    for (let i = 0; i < planterToday.length; i++) {
      data.push({ x: timeGraphArr[i], y: workingGraphArr[i] });
    }
    return data;
  }, [workingGraphArr, timeGraphArr]);

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
          // labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24], // 오늘 날짜의 일수를 라벨로 사용
          datasets: [
            {
              // data: workingGraphArr,
              data: workingGraphTimeArr,
              borderColor: "#FB97A3",
              pointBackgroundColor: "#FB97A3",
              pointBorderColor: "#4F5B6C",
              borderWidth: 3,
              fill: false,
              lineTension: 0.6,
              pointHoverRadius: 6,
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
              top: 50,
            },
          },
          maintainAspectRatio: false, //그래프 크기를 조절하기 위해서
          scales: {
            x: {
              type: "time",
              time: {
                unit: "hour",
              },
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
                  return context[0].raw.x.split("T")[1].slice(0, 5);
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
      {/* <S.Legend>
        <div className="legend-inner">
          {!!nameColorArray &&
            nameColorArray?.map((data, index) => {
              return (
                <div className="inner" key={`map${index}`}>
                  <p>{data.name}</p>
                  <div className="legend-color" style={{ backgroundColor: data.color }}></div>
                </div>
              );
            })}
        </div>
      </S.Legend> */}
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphTodayProduction;
