import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

import usePlanterTotal from "@src/hooks/queries/planter/usePlanterTotal";

const S = {
  Wrap: styled.div`
    height: 360px;
    width: 100%;
  `,
};

function GraphTotalProduction() {
  const { data: planterTotal } = usePlanterTotal({
    queryType: "month",
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    if (!planterTotal) {
      return;
    }

    const dataArray = [];
    for (let i = 0; i < 12; i++) {
      const data = null;
      dataArray.push(data);
    }

    planterTotal?.map((data) => {
      dataArray[data?.month - 1] = data?.output;
    });

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
          labels: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
          datasets: [
            {
              data: dataArray,
              backgroundColor: "#C8B4F7",
              hoverBackgroundColor: "#C8B4F7",
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
  }, [planterTotal]);

  return (
    <S.Wrap>
      <canvas ref={graphRef} />
    </S.Wrap>
  );
}

export default GraphTotalProduction;
