import React, { useRef, useEffect } from "react";
import styled from "styled-components";

import Chart from "chart.js/auto";
import { registerables } from "chart.js";

import usePlanterOperatingTime from "@src/hooks/queries/planter/usePlanterOperatingTime";

const S = {
  Wrap: styled.div`
    height: 360px;
    width: 100%;
    gap: 50px;
    display: flex;
    flex-direction: column;
  `,
  Doughnut: styled.div`
    height: 50vh;
    width: 100%;
    flex: 1;
  `,
  InfoBlockWrap: styled.div`
    width: 100%;
    display: flex;
    gap: 20px;
    flex: 1;
  `,
  InfoBlock: styled.div`
    padding: 30px;
    background-color: #f7f7fa;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: center;
    align-items: center;
    width: 100%;

    p {
      color: #405f8d;
    }
    .info-title {
      font-size: 16px;
      font-weight: 400;
      line-height: 20px;
    }
    .info-hour {
      font-size: 32px;
      font-weight: 700;
      line-height: 36px;
    }
    .info-name {
      font-size: 16px;
      font-weight: 700;
      line-height: 20px;
    }
  `,
};

function GraphOperateTimeMonth() {
  const { data: planterOperation } = usePlanterOperatingTime({
    queryType: "month",
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  const graphRef = useRef(null);
  let graphInstance = null;

  useEffect(() => {
    if (!planterOperation) {
      return;
    }

    const graphCtx = graphRef.current?.getContext("2d");

    const textCenter = {
      id: "textCenter",
      afterDatasetsDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { top, bottom, left, right, width, height },
        } = chart;

        ctx.save();
        ctx.font = "normal 20px Pretendard";
        ctx.fillStyle = "#405F8D";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("평균", width / 2, height / 2 - 13);
        ctx.restore();

        ctx.font = "bolder 32px Pretendard";
        ctx.fillStyle = "#405F8D";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(Math.floor(planterOperation?.total_avg / 3600) + "h", width / 2, height / 2 + top + 13);
      },
    };

    const graphChart = () => {
      Chart.register(...registerables);
      graphInstance = new Chart(graphCtx, {
        type: "doughnut",
        data: {
          datasets: [
            {
              data: [
                Math.floor(planterOperation?.total_avg / 3600),
                24 - Math.floor(planterOperation?.total_avg / 3600),
              ], // 여기서 첫 번째 데이터는 강조하고자 하는 값, 두 번째 데이터는 나머지 비율
              backgroundColor: ["#8DBAEF", "#F7F7FA"],
              borderColor: ["#8DBAEF", "#F7F7FA"],
              hoverBackgroundColor: ["#8DBAEF", "#F7F7FA"],
              hoverBorderColor: ["#8DBAEF", "#F7F7FA"],
              borderWidth: 1,
              borderRadius: 5,
            },
          ],
        },
        plugins: [textCenter],

        options: {
          plugins: {
            tooltip: {
              enabled: false,
            },
          },
          cutout: "80%", // 도넛 차트의 중앙 공간 설정,
          maintainAspectRatio: false, //그래프 크기를 조절하기 위해서
          scales: {
            x: {
              display: false,
            },
            y: {
              display: false,
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
  }, [planterOperation]);

  return (
    <S.Wrap>
      <S.Doughnut>
        <canvas ref={graphRef} height={235} />
      </S.Doughnut>
      <S.InfoBlockWrap>
        <S.InfoBlock>
          <p className="info-title">최대 가동 시간</p>
          <p className="info-hour">{Math.floor(planterOperation?.max?.operating_time / 3600)}h</p>
          <p className="info-name">{planterOperation?.max?.farmhouse_name}</p>
        </S.InfoBlock>
        <S.InfoBlock>
          <p className="info-title">최소 가동 시간</p>
          <p className="info-hour">{Math.floor(planterOperation?.min?.operating_time / 3600)}h</p>
          <p className="info-name">{planterOperation?.min?.farmhouse_name}</p>
        </S.InfoBlock>
      </S.InfoBlockWrap>
    </S.Wrap>
  );
}

export default GraphOperateTimeMonth;
