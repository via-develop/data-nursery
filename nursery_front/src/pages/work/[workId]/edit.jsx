import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import axios from "axios";

import useCropList from "@hooks/queries/crop/useCropList";
import useTrayList from "@hooks/queries/planter/useTrayList";
import useUpdateWork from "@hooks/queries/planter/useUpdateWork";
import useWorkInfo from "@hooks/queries/planter/useWorkInfo";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { getUserInfoUrl } from "@apis/authAPIs";

import MainLayout from "@components/layout/MainLayout";
import DefaultInput from "@components/common/input/DefaultInput";
import DefaultCalendar from "@components/common/calendar/DefaultCalendar";
import SuffixInput from "@components/common/input/SuffixInput";
import DefaultSelect from "@components/common/select/DefaultSelect";
import DefaultSelectList from "@components/common/select/DefaultSelectList";
import CalendarButton from "@components/common/button/CalendarButton";

import { isDefaultAlertShowState } from "@states/isDefaultAlertShowState";
import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import { defaultButtonColor, disableButtonColor } from "@utils/ButtonColor";
import OnRadioBtnIcon from "@images/common/on-radio-btn.svg";
import OffRadioBtnIcon from "@images/common/off-radio-btn.svg";
import PointIcon from "@images/work/ico-point.svg";
import { waitWorkListKey } from "@utils/query-keys/PlanterQueryKeys";
import { DateFormatting } from "@utils/Formatting";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    height: 100%;
    overflow-y: auto;
    padding: 16px 24px 29px 24px;
  `,
  InputWrap: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    .category-wrap {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .category-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .seed-quantity-description-text {
      ${({ theme }) => theme.textStyle.h7Regular}
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
};

function WorkEditPage({ workId }) {
  const router = useRouter();
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  // 스크롤 유무 판단하기 위함
  const [isScroll, setIsScroll] = useState(false);

  // BottomButton 정보
  const [buttonSetting, setButtonSetting] = useState({
    color: disableButtonColor,
    text: "수정완료",
    onClickEvent: () => {},
  });

  // 입력값 정보
  const [inputData, setInputData] = useState({
    cropKind: "", // 품종
    sowingDate: new Date(), // 파종일
    deadline: "", // 출하일
    orderQuantity: "", // 주문수량
    seedQuantity: 0, // 파종량
    planterTray: "", // 트레이
    crop: "", // 작물
  });

  // 캘린더
  const [calendarOpen, setCalendarOpen] = useState({
    open: false,
    type: "",
    date: new Date(),
    afterFn: null,
  });

  // 작물 선택
  const [isCropSelectOpen, setIsCropSelectOpen] = useState(false);

  // 트레이 선택
  const [isTraySelectOpen, setIsTraySelectOpen] = useState(false);

  // 스크롤 감지
  const contentScroll = useCallback((e) => {
    if (e.target.scrollTop > 0) {
      setIsScroll(true);
    } else {
      setIsScroll(false);
    }
  }, []);

  // 입력값 변경
  const handleInputChange = useCallback(
    (name, value) => {
      setInputData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    [inputData],
  );

  // 파종량 계산
  useEffect(() => {
    if (!!inputData.planterTray && !!inputData.orderQuantity) {
      handleInputChange("seedQuantity", inputData.planterTray.total * inputData.orderQuantity);
    } else {
      handleInputChange("seedQuantity", 0);
    }
  }, [inputData.planterTray, inputData.orderQuantity]);

  // 출하일 계산
  useEffect(() => {
    const changeDate = new Date(inputData.sowingDate);
    handleInputChange("deadline", changeDate.setDate(changeDate.getDate() + 45));
  }, [inputData.sowingDate]);

  // BottomButton 활성화 여부
  useEffect(() => {
    // 입력 값 중 빈값이 없을 경우
    if (!Object.values(inputData).includes("")) {
      setButtonSetting({
        color: defaultButtonColor,
        text: "수정완료",
        onClickEvent: () => {
          updateWorkMutate({
            data: {
              workId: workId,
              sowing_date: inputData.sowingDate,
              deadline: inputData.deadline,
              crop_id: inputData.crop.id.toString(),
              crop_kind: inputData.cropKind,
              planter_tray_id: inputData.planterTray.id,
              order_quantity: inputData.orderQuantity,
              seed_quantity: inputData.seedQuantity,
              is_del: null,
            },
          });
        },
      });
    } else {
      // 입력 값 중 빈값이 있을 경우
      setButtonSetting({
        color: disableButtonColor,
        text: "수정완료",
        onClickEvent: () => {},
      });
    }
  }, [inputData]);

  // 작업 정보 API
  const { data: workInfo, isLoading: workInfoLoading } = useWorkInfo({
    workId: workId,
    successFn: (res) => {
      setInputData({
        cropKind: res.planter_work.crop_kind, // 품종
        sowingDate: new Date(res.planter_work.sowing_date), // 파종일
        deadline: new Date(res.planter_work.deadline), // 출하일
        orderQuantity: res.planter_work.order_quantity, // 주문수량
        seedQuantity: res.planter_work.seed_quantity, // 파종량
        planterTray: res.planter_tray, // 트레이
        crop: res.crop, // 작물
      });
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작물 목록 API
  const { data: cropList, isLoading: cropListLoading } = useCropList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 트레이 목록 API
  const { data: trayList, isLoading: trayListLoading } = useTrayList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작업 수정 API
  const { mutate: updateWorkMutate } = useUpdateWork(
    () => {
      // 대기중인 작업 목록 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([waitWorkListKey]);
      // 작업 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([workInfo, workId]);
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
      router.push(`/work/${workId}`);
    },
    (error) => {
      setIsDefaultAlertShowState({
        isShow: true,
        type: "error",
        text: "오류가 발생했습니다.",
        okClick: null,
      });
    },
  );

  return (
    <MainLayout
      pageName={"작업정보수정"}
      isLoading={workInfoLoading || cropListLoading || trayListLoading}
      isScroll={isScroll}
      backIconClickFn={() => {
        router.push(`/work/${workId}`);
      }}
      buttonSetting={buttonSetting}>
      <S.Wrap onScroll={contentScroll}>
        <S.InputWrap>
          <p className="category-text">파종일</p>
          <CalendarButton
            text={DateFormatting(inputData.sowingDate)}
            onClick={() => {
              setCalendarOpen({
                open: true,
                type: "파종일",
                date: inputData.sowingDate,
                afterFn: (date) => {
                  handleInputChange("sowingDate", date);
                },
              });
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">출하일</p>
          </div>
          <CalendarButton
            text={DateFormatting(inputData.deadline)}
            onClick={() => {
              setCalendarOpen({
                open: true,
                type: "출하일",
                date: inputData.deadline,
                afterFn: (date) => {
                  handleInputChange("deadline", date);
                },
              });
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">작물</p>
          </div>
          <DefaultSelect
            isSelected={!!inputData.crop}
            text={!!inputData.crop ? inputData.crop.name : "작물을 선택하세요"}
            isSelectOpen={isCropSelectOpen}
            onClick={() => {
              setIsCropSelectOpen(!isCropSelectOpen);
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">품종</p>
          </div>
          <DefaultInput
            text={inputData.cropKind}
            setText={(e) => {
              handleInputChange("cropKind", e.target.value.replace(" ", ""));
            }}
            placeholder={"품종명을 입력하세요"}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">트레이</p>
          </div>
          <DefaultSelect
            isSelected={!!inputData.planterTray}
            text={!!inputData.planterTray ? inputData.planterTray.total : "트레이를 선택하세요"}
            isSelectOpen={isTraySelectOpen}
            onClick={() => {
              setIsTraySelectOpen(!isTraySelectOpen);
            }}
          />
        </S.InputWrap>
        <S.InputWrap>
          <div className="category-wrap">
            <div className="essential-category-icon" />
            <p className="category-text">주문수량</p>
          </div>
          <SuffixInput
            text={inputData.orderQuantity}
            setText={(e) => {
              handleInputChange("orderQuantity", e.target.value.replace(/[^0-9]/g, ""));
            }}
            placeholder={"작업수량을 입력하세요"}
            suffix={"장"}
          />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">파종량</p>
          <SuffixInput text={inputData.seedQuantity} readOnly={true} suffix={"개"} />
          <div className="category-wrap">
            <PointIcon />
            <p className="seed-quantity-description-text">자동계산되며, 실제파종량과 다를 수 있습니다.</p>
          </div>
        </S.InputWrap>
        <DefaultCalendar
          calendarOpen={calendarOpen}
          setCalendarOpen={setCalendarOpen}
          sowingDate={inputData.sowingDate}
        />
        {isCropSelectOpen && (
          <DefaultSelectList
            onClickEvent={() => {
              setIsCropSelectOpen(false);
            }}>
            <p className="select-category-text">작물선택</p>
            <div className="value-list-wrap" id="scroll-wrap">
              {cropList?.crops.map((crop) => {
                return (
                  <div
                    key={crop.id}
                    className={"row-layout"}
                    onClick={() => {
                      handleInputChange("crop", crop);
                      setIsCropSelectOpen(false);
                    }}>
                    {inputData.crop?.id === crop.id && <OnRadioBtnIcon />}
                    {inputData.crop?.id !== crop.id && <OffRadioBtnIcon />}
                    <p className="value-text">{crop.name}</p>
                  </div>
                );
              })}
            </div>
          </DefaultSelectList>
        )}
        {isTraySelectOpen && (
          <DefaultSelectList
            onClickEvent={() => {
              setIsTraySelectOpen(false);
            }}>
            <p className="select-category-text">트레이 선택</p>
            <div className="value-list-wrap" id="scroll-wrap">
              {trayList?.planter_trays.map((tray) => {
                return (
                  <div
                    key={tray.id}
                    className={"row-layout"}
                    onClick={() => {
                      handleInputChange("planterTray", tray);
                      setIsTraySelectOpen(false);
                    }}>
                    {inputData.planterTray?.id === tray.id && <OnRadioBtnIcon />}
                    {inputData.planterTray?.id !== tray.id && <OffRadioBtnIcon />}
                    <p className="value-text">{tray.total}</p>
                  </div>
                );
              })}
            </div>
          </DefaultSelectList>
        )}
      </S.Wrap>
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication(async (context) => {
  const userInfoRes = await axios.get(getUserInfoUrl(true), {
    headers: { Cookie: context.req.headers.cookie },
  });

  // 파종기 미등록 시 파종기 등록페이지로 이동
  if (!userInfoRes.data.planter.is_register) {
    return {
      redirect: {
        destination: "/QR-scanner",
        statusCode: 302,
      },
    };
  }

  if (!context.query.workId) {
    return {
      redirect: {
        destination: "/",
        statusCode: 302,
      },
    };
  } else {
    return {
      props: {
        workId: context.query.workId,
      },
    };
  }
});

export default WorkEditPage;
