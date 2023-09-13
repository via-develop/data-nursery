import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Button } from "react-bootstrap";

import useUserInfo from "@hooks/queries/auth/useUserInfo";
import useAllCacheClear from "@hooks/queries/common/useAllCacheClear";

import MainLayout from "@components/layout/MainLayout";
import DefaultModal from "@components/common/modal/DefaultModal";
import DefaultInput from "@components/common/input/DefaultInput";

import { requireAuthentication } from "@utils/LoginCheckAuthentication";
import userLogout from "@utils/userLogout";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;

    p {
      white-space: nowrap;
      overflow: hidden;
      text-align: center;
      text-overflow: ellipsis;
    }
  `,
  FarmHouseNameWrap: styled.div`
    padding: 24px 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 84px;
    background-color: #5899fb;
    position: sticky;

    p {
      ${({ theme }) => theme.textStyle.h3Bold}
      color: #ffffff;
    }
  `,
  InfoWrap: styled.div`
    padding: 38px 24px;
    height: calc(100% - 84px);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  `,
  InfoContent: styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;

    p {
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    .title-text {
      color: ${({ theme }) => theme.basic.grey50};
    }
  `,
  LogoutButtonWrap: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 8px;
  `,
  LogoutButton: styled(Button)`
    width: fit-content;
    height: 44px;
    padding: 12px 24px !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    ${({ theme }) => theme.textStyle.h6Bold}
    border-radius: 8px !important;

    color: ${({ theme }) => theme.basic.grey50} !important;
    background-color: #ffffff !important;
    border: 1px solid ${({ theme }) => theme.basic.recOutline} !important;
  `,
};

function NurseryInformationPage() {
  const router = useRouter();
  const clearQueries = useAllCacheClear();

  const [modalOpen, setModalOpen] = useState({
    open: false,
    type: "",
    title: "",
    description: "",
    btnType: "",
    afterFn: null,
  });

  // 유저 정보 API
  const { data: userInfo } = useUserInfo({
    successFn: () => {},
    errorFn: () => {
      userLogout(router, clearQueries);
    },
  });

  return (
    <MainLayout
      pageName={"농가정보"}
      backIconClickFn={() => {
        router.push("/");
      }}
      backgroundColor="#5899FB">
      <S.Wrap>
        <S.FarmHouseNameWrap>
          <p>{userInfo?.farm_house.name}</p>
        </S.FarmHouseNameWrap>
        <S.InfoWrap>
          <S.InfoContent>
            <p className="title-text">파종기 S/N</p>
            <DefaultInput text={userInfo?.planter.serial_number} readOnly={true} />
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">농가 ID</p>
            <DefaultInput text={userInfo?.farm_house.farm_house_id} readOnly={true} />
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">육묘업 등록번호</p>
            <DefaultInput text={userInfo?.farm_house.nursery_number} readOnly={true} />
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">주소</p>
            <DefaultInput text={userInfo?.farm_house.address} readOnly={true} />
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">생산자명</p>
            <DefaultInput text={userInfo?.farm_house.producer_name} readOnly={true} />
          </S.InfoContent>
          <S.InfoContent>
            <p className="title-text">연락처</p>
            <DefaultInput text={userInfo?.farm_house.phone} readOnly={true} />
          </S.InfoContent>
          <S.LogoutButtonWrap>
            <S.LogoutButton
              onClick={() => {
                setModalOpen({
                  open: true,
                  type: "error",
                  title: "로그아웃을\n진행하시겠습니까?",
                  btnType: "two",
                  afterFn: () => {
                    userLogout(router, clearQueries);
                  },
                });
              }}>
              로그아웃
            </S.LogoutButton>
          </S.LogoutButtonWrap>
        </S.InfoWrap>
      </S.Wrap>
      <DefaultModal modalOpen={modalOpen} setModalOpen={setModalOpen} />
    </MainLayout>
  );
}

// 로그인 안되어 있을 경우 로그인 페이지로 이동
export const getServerSideProps = requireAuthentication((context) => {
  return { props: {} };
});

export default NurseryInformationPage;
