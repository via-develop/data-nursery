import React from "react";
import styled from "styled-components";
import MainSideMenu from "@components/layout/MainSideMenu";
import DefaultAlert from "@components/common/alert/DefaultAlert";

const S = {
  Wrap: styled.div`
    width: 100%;
    flex: 1;
    position: relative;
  `,
  MainContent: styled.main`
    align-items: stretch;
    display: flex;

    .main-children-section {
      flex: 1;
      padding: 64px 79px 112px 79px;
      background-color: #f7f7fa;
    }
  `,
};

function MainLayout({ children }) {
  return (
    <S.Wrap>
      <S.MainContent>
        <MainSideMenu />
        <section className="main-children-section">{children}</section>
        <DefaultAlert />
      </S.MainContent>
    </S.Wrap>
  );
}

export default MainLayout;
