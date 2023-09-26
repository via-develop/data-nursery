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
    .legend-inner {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 8px;
    }
    .legend-color {
      width: 18px;
      height: 4px;
      display: flex;
      align-items: center;
      border-radius: 3px;
    }
    .inner {
      display: flex;
      justify-content: end;
      align-items: center;
      gap: 8px;
    }
  `,
};

function GraphCropProductionMonth() {
  const { data: planterCrops } = usePlanterCrop({
    queryType: "month",
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  //범례에서 사용할 배열
  const nameColorArray =
    !!planterCrops &&
    Object.keys(planterCrops).map((key) => ({
      name: key,
      color: planterCrops[key][0].color,
    }));

  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    if (!planterCrops) {
      return;
    }

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
          labels: Array.from({ length: 12 }, (_, i) => i + 1),
          datasets: Object.keys(planterCrops).map((key) => ({
            label: key,
            data: Array.from({ length: 12 }, (_, i) => {
              // key에 해당하는 데이터를 라벨과 매칭
              const dayData = planterCrops[key].find((item) => item.day === i + 1);
              return dayData ? dayData.output : 0;
            }),
            borderColor: planterCrops[key][0].color, // key에 해당하는 첫 번째 데이터의 color를 사용
            pointBackgroundColor: planterCrops[key][0].color, // key에 해당하는 첫 번째 데이터의 color를 사용
            pointBorderColor: "#4F5B6C",
            borderWidth: 3,
            fill: false,
            lineTension: 0.6,
            pointHoverRadius: 6,
            pointRadius: 0,
            pointHoverBorderWidth: 5,
            pointHoverBackgroundColor: "#fff",
          })),
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
              // title: {
              //   display: true,
              //   align: "end",
              //   text: "개 (단위 : 만)",
              // },
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
  }, [planterCrops]);

  return (
    <S.Wrap>
      <S.Legend>
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
      </S.Legend>
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphCropProductionMonth;
