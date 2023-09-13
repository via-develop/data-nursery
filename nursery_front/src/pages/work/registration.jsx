import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useCropList from "@hooks/queries/crop/useCropList";
import useTrayList from "@hooks/queries/planter/useTrayList";
import useRegisterWork from "@hooks/queries/planter/useRegisterWork";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";

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
import userLogout from "@utils/userLogout";

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

function WorkRegistrationPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  // BottomButton 정보
  const [buttonSetting, setButtonSetting] = useState({
    color: disableButtonColor,
    text: "등록완료",
    onClickEvent: () => {},
  });

  // 입력값 정보
  const [inputData, setInputData] = useState({
    cropKind: "", // 품종
    sowingDate: new Date(), // 파종일
    deadline: new Date(new Date().setDate(new Date().getDate() + 45)), // 출하일
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

  // BottomButton 활성화 여부
  useEffect(() => {
    // 입력 값 중 빈값이 없을 경우
    if (!Object.values(inputData).includes("")) {
      setButtonSetting({
        color: defaultButtonColor,
        text: "등록완료",
        onClickEvent: () => {
          registerWorkMutate({
            data: {
              crop_kind: inputData.cropKind,
              sowing_date: inputData.sowingDate,
              deadline: inputData.deadline,
              order_quantity: inputData.orderQuantity,
              seed_quantity: inputData.seedQuantity,
              planter_tray_id: inputData.planterTray.id,
              crop_id: inputData.crop.id,
            },
          });
        },
      });
    } else {
      // 입력 값 중 빈값이 있을 경우
      setButtonSetting({
        color: disableButtonColor,
        text: "등록완료",
        onClickEvent: () => {},
      });
    }
  }, [inputData]);

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  // 작물 목록 API
  const { data: cropList } = useCropList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 트레이 목록 API
  const { data: trayList } = useTrayList({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

  // 작업 등록 API
  const { mutate: registerWorkMutate } = useRegisterWork(
    () => {
      // 대기중인 작업 목록 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([waitWorkListKey]);
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 등록되었습니다.",
        okClick: null,
      });
      router.push("/");
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
      pageName={"작업 등록"}
      backIconClickFn={() => {
        router.push("/");
      }}
      buttonSetting={buttonSetting}>
      <S.Wrap>
        <S.InputWrap>
          <p className="category-text">육묘업 등록번호</p>
          <DefaultInput text={userInfo?.farm_house.nursery_number} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">주문자</p>
          <DefaultInput text={"개인"} readOnly={true} />
        </S.InputWrap>
        <S.InputWrap>
          <p className="category-text">파종일</p>
          <DefaultInput text={DateFormatting(new Date())} readOnly={true} />
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
        <DefaultCalendar calendarOpen={calendarOpen} setCalendarOpen={setCalendarOpen} />
        {isCropSelectOpen && (
          <DefaultSelectList>
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
          <DefaultSelectList>
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
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default WorkRegistrationPage;
