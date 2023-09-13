import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled, { css } from "styled-components";

import BottomBar from "@components/layout/BottomBar";

import BackIcon from "@images/common/arrow-left.svg";
import MoreIcon from "@images/common/more-icon.svg";
import MyInfoIcon from "@images/common/my-info-icon.svg";
import theme from "@src/styles/theme";
import DefaultAlert from "@components/common/alert/DefaultAlert";
import DefaultButton from "@components/common/button/DefaultButton";
import { defaultButtonColor } from "@utils/ButtonColor";
import DefaultDropdown from "@components/common/dropdown/DefaultDropdown";

const S = {
  BackgroundWrap: styled.div`
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;

    background-image: url("/images/common/pc-background-image.svg");
    background-repeat: no-repeat;
    background-size: cover;

    ${({ theme }) => theme.media.max_mobile} {
      height: 100svh;
    }
  `,
  Wrap: styled.main`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    max-height: 800px;
    height: 100%;
    width: 813px;

    ${({ theme }) => theme.media.max_tablet} {
      justify-content: center;
    }

    ${({ theme }) => theme.media.max_mobile} {
      width: 100%;
      max-height: 100%;
    }
  `,
  WebText: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 193px;

    .description-text {
      font-size: 16px;
      line-height: 21.5px;
      color: ${({ theme }) => theme.basic.deepBlue};
      white-space: pre-line;
      text-align: center;
    }

    .logo-text {
      font-family: Ubuntu;
      font-size: 34.307px;
      font-weight: 700;
      letter-spacing: -0.686px;
      color: ${({ theme }) => theme.basic.deepBlue};
    }

    ${({ theme }) => theme.media.max_tablet} {
      display: none;
    }
  `,
  MainLayout: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: 360px;
    height: 100%;

    border-radius: 24px;
    overflow: hidden;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    ${({ theme }) => theme.media.max_mobile} {
      width: 100%;
      border-radius: 0px;
      box-shadow: none;
    }
  `,
  MainContent: styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-color: ${(props) => (props.backgroundColor === "#272727" ? "#272727" : "#ffffff")};

    .main-page-name {
      padding: 16px 24px 0px 24px;
      align-items: flex-start;
    }

    .content {
      height: ${(props) => props.height};
    }
  `,
  PageNameWrap: styled.div`
    width: 100%;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0px;
    padding: 16px 24px;
    z-index: 99;
    background-color: ${(props) => props.backgroundColor};

    svg {
      cursor: pointer;
      fill: ${(props) => (props.backgroundColor === "#ffffff" ? "#929FA6" : "#ffffff")};
    }

    p {
      width: calc(100% - 72px);

      ${({ theme }) => theme.textStyle.h3Bold}
      color: ${(props) => (props.backgroundColor === "#ffffff" ? theme.basic.grey60 : "#ffffff")};

      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 1px;
      align-items: flex-start;
      justify-content: flex-start;
    }

    .date-text {
      width: fit-content;
      ${({ theme }) => theme.textStyle.h7Bold}
      color: ${({ theme }) => theme.basic.grey50};
    }

    .logo-text {
      width: fit-content;
      color: #4b86dd;
      font-family: Ubuntu;
      font-size: 24.804px;
      font-weight: 700;
      letter-spacing: -0.496px;
      margin-top: 1px;
    }

    ${(props) =>
      props.isBackIcon
        ? css`
            .back-icon-wrap {
              visibility: visible;
            }
          `
        : css`
            .back-icon-wrap {
              visibility: hidden;
            }
          `}
    ${(props) =>
      props.isMoreIcon
        ? css`
            .more-icon-wrap {
              visibility: visible;
            }
          `
        : css`
            .more-icon-wrap {
              visibility: hidden;
            }
          `}
  `,
  BottomButtonWrap: styled.div`
    height: ${(props) => props.height};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    position: sticky;
    bottom: 0px;
    background: #ffffff;
    box-shadow: 0px -4px 10px 0px rgba(165, 166, 168, 0.16);
    padding: 8px 24px;

    .work-start-text {
      ${({ theme }) => theme.textStyle.h6Bold}
      color: ${({ theme }) => theme.basic.warning};
    }
  `,
};

// pageName : 헤더에서 나타낼 페이지이름, 아무값도 넘겨주지 않으면 헤더 비활성화
// isBackIcon : 헤더에서 뒤로가기 아이콘 표시 유무
// backIconClickFn : 뒤로가기 아이콘 클릭 시 실행되는 함수
// isMoreIcon : 헤더에서 ... 표시 유무
// backgroundColor : 헤더 배경 색상
// buttonSetting : color은 표시할 버튼의 색(호버, 포커스 등 포함), text는 버튼에 표시될 값, onClickEvent는 버튼 클릭 시 실행될 함수
function MainLayout({
  children,
  pageName,
  isBackIcon = true,
  backIconClickFn,
  isMoreIcon = false,
  backgroundColor = "#ffffff",
  buttonSetting = { color: defaultButtonColor, text: "", onClickEvent: null },
}) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 오늘 날짜
  const today = useMemo(() => {
    const date = new Date();

    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      timeZone: "Asia/Seoul",
      calendar: "korean",
    };

    return new Intl.DateTimeFormat("ko-KR", options).format(date).split(" ");
  }, []);

  const [mainContentHeight, setMainContentHeight] = useState("100%");

  // 헤더 및 바텀바 유무에 따라 내부 콘텐츠 height 지정
  useEffect(() => {
    if (pageName === "main") {
      setMainContentHeight("calc(100% - 160px)");
    } else if (pageName === "작업 정보" && !!buttonSetting) {
      // 작업 정보 페이지의 시작버튼 있을 경우
      setMainContentHeight("calc(100% - 196px)");
    } else if (pageName === "작업 등록" || pageName === "작업정보수정") {
      // 작업 등록, 작업정보수정 페이지
      setMainContentHeight("calc(100% - 162px)");
    } else if (!!pageName) {
      setMainContentHeight("calc(100% - 72px)");
    } else {
      setMainContentHeight("100%");
    }
  }, [pageName, isMoreIcon, buttonSetting]);

  return (
    <S.BackgroundWrap>
      <S.Wrap>
        <S.WebText>
          <p className="description-text">대한민국 NO.1{"\n"}자동파종기 관리 시스템</p>
          <p className="logo-text">Data Nursery</p>
        </S.WebText>
        <S.MainLayout>
          <S.MainContent height={mainContentHeight} backgroundColor={backgroundColor}>
            {pageName === "main" && (
              <S.PageNameWrap className="main-page-name" backgroundColor={backgroundColor}>
                <div className="text-wrap">
                  <p className="date-text">{today[0] + today[1] + today[2].replace(".", " ") + today[3]}</p>
                  <p className="logo-text">Data Nursery</p>
                </div>
                <MyInfoIcon
                  onClick={() => {
                    router.push("/nursery-information");
                  }}
                />
              </S.PageNameWrap>
            )}
            {!!pageName && pageName !== "main" && (
              <S.PageNameWrap isBackIcon={isBackIcon} isMoreIcon={isMoreIcon} backgroundColor={backgroundColor}>
                <BackIcon className="back-icon-wrap" onClick={backIconClickFn} />
                <p>{pageName}</p>
                <MoreIcon
                  className="more-icon-wrap"
                  onClick={() => {
                    setDropdownOpen(true);
                  }}
                />
              </S.PageNameWrap>
            )}
            <div className="content">{children}</div>
            {pageName === "작업 정보" && !!buttonSetting && (
              <S.BottomButtonWrap height={"124px"}>
                {isMoreIcon && <p className="work-start-text">시작을 눌러 작업을 시작하세요!</p>}
                {!isMoreIcon && <p className="work-start-text">버튼을 눌러 작업을 완료하세요!</p>}
                <DefaultButton
                  customStyle={buttonSetting.color}
                  text={buttonSetting.text}
                  onClick={buttonSetting.onClickEvent}
                />
              </S.BottomButtonWrap>
            )}
            {(pageName === "작업 등록" || pageName === "작업정보수정") && (
              <S.BottomButtonWrap height={"90px"}>
                {isMoreIcon && <p className="work-start-text">시작을 눌러 작업을 시작하세요!</p>}
                <DefaultButton
                  customStyle={buttonSetting.color}
                  text={buttonSetting.text}
                  onClick={buttonSetting.onClickEvent}
                />
              </S.BottomButtonWrap>
            )}
            {pageName === "main" && <BottomBar />}
            <DefaultAlert />
            <DefaultDropdown dropdownOpen={dropdownOpen} setDropdownOpen={setDropdownOpen} />
          </S.MainContent>
        </S.MainLayout>
      </S.Wrap>
    </S.BackgroundWrap>
  );
}

export default MainLayout;
