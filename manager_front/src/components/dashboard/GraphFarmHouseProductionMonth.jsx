import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

import usePlanterFarm from "@src/hooks/queries/planter/usePlanterFarm";

const S = {
  Wrap: styled.div`
    padding: 0px 40px;

    .scrollBox {
      max-height: 300px;
      overflow-y: scroll;
    }
    .scrollBoxBody {
      width: 100%;
    }
  `,
};

function GraphFarmHouseProductionMonth() {
  const { data: planterFarm } = usePlanterFarm({
    queryType: "month",
    successFn: () => {},
    errorFn: (err) => {
      console.log("!!err", err);
    },
  });

  console.log("planterFarm", planterFarm);
  // const dataArray = planterTotal?.map((item) => item.output);

  //육묘장 이름
  const nameArray = planterFarm?.map((item) => item.farmhouse_name);
  // nameArray.push(' ')
  // nameArray.push(' ')
  // nameArray.push(' ')
  // nameArray.push(' ')
  // nameArray.push(' ')
  // nameArray.push(' ')
  // nameArray.push(' ')

  //육묘장 데이터
  const dataArray = planterFarm?.map((item) => item.total_output);
  // dataArray.push('null')
  // dataArray.push('null')
  // dataArray.push('null')
  // dataArray.push('null')
  // dataArray.push('null')
  // dataArray.push('null')
  // dataArray.push('null')

  const graphRef = useRef(null);
  const graphUnitRef = useRef(null);

  let graphInstance = null;
  let graphUnitInstance = null;

  useEffect(() => {
    if (!planterFarm) {
      return;
    }

    const graphCtx = graphRef.current?.getContext("2d");
    const graphUnitCtx = graphUnitRef.current?.getContext("2d");

    const horizontalBackgroundPlugin = {
      id: "horizontalBackgroundPlugin",
      beforeDatasetsDraw(chart, args, plugins) {
        const {
          ctx,
          data,
          chartArea: { top, bottom, left, right, width, height },
          scales: { x, y },
        } = chart;

        const barPercentage = data.datasets[0].barPercentage || 0.9;
        const categoryPercentage = data.datasets[0].categoryPercentage || 0.8;
        const barThickness = (height / data.labels.length) * barPercentage * categoryPercentage;

        ctx.save();
        ctx.fillStyle = "#F7F7FA";
        data.labels.forEach((bar, index) => {
          ctx.fillRect(left, y.getPixelForValue(index) - barThickness / 2, width, barThickness);
        });
        ctx.restore();
      },
    };

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "bar",
        data: {
          labels: nameArray,
          // [
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          //   "보천육묘장",
          // ],
          datasets: [
            {
              data: dataArray,
              // data: [12, 20, 3, 10, 2, 3, 9, 1, 3, 3, 9, 10],
              backgroundColor: "#FFB78E",
              hoverBackgroundColor: "#FFB78E",
              borderRadius: 4,
              borderWidth: 1,
              barPercentage: 0.9,
              categoryPercentage: 0.8,
            },
          ],
        },
        plugins: [horizontalBackgroundPlugin],
        options: {
          maintainAspectRatio: false,
          indexAxis: "y", // 그래프 가로형
          interaction: {
            intersect: false, // 툴팁 데이터위에 hover했을때만 나오게 하는것 false
          },
          responsive: false, // 그래프 크기를 조절하기 위해서
          scales: {
            x: {
              grid: {
                drawOnChartArea: false,
                drawTicks: false,
                drawBorder: false,
              },
              ticks: {
                display: false,
              },
              display: false,
            },
            y: {
              grid: {
                drawOnChartArea: false,
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

    const graphUnitChart = () => {
      Chart.register(...registerables);
      graphUnitInstance = new Chart(graphUnitCtx, {
        type: "bar",
        data: {
          datasets: [
            {
              data: graphInstance.data.datasets[0].data,
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
              afterFit: (context) => {
                context.height += 23;
              },
              title: {
                display: true,
                align: "end",
                text: "개 (단위 : 만)",
              },
            },
            y: {
              afterFit: (context) => {
                context.width += graphInstance.chartArea.left;
              },
              grid: {
                drawTicks: false,
              },
            },
          },
          responsive: false, // 그래프 크기를 조절하기 위해서
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    };

    const destroyChart = () => {
      if (graphInstance) {
        graphInstance.destroy();
        graphInstance = null;
      }
      if (graphUnitInstance) {
        graphUnitInstance.destroy();
        graphUnitInstance = null;
      }
    };

    destroyChart(); // 기존 차트 파괴
    graphChart();
    graphUnitChart();

    return () => {
      destroyChart(); // 컴포넌트가 unmount될 때 차트 파괴
    };
  }, [planterFarm, graphRef, graphUnitRef]);

  return (
    <S.Wrap>
      <div className="scrollBox">
        <div className="scrollBoxBody">
          <canvas ref={graphRef} height={450} width={530} />
        </div>
      </div>
      <div className="box">
        <canvas ref={graphUnitRef} height={45} width={530} />
      </div>
    </S.Wrap>
  );
}

export default GraphFarmHouseProductionMonth;
