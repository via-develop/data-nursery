import React from "react";
import Image from "next/image";
import { styled } from "styled-components";
import { useRouter } from "next/router";

import ListIcon from "@images/common/icon-list.svg";
import FarmIcon from "@images/common/icon-house.svg";
import GraphIcon from "@images/common/w-icon-graph.svg";
import SettingIcon from "@images/common/w-icon-setting.svg";
import AiIcon from "@images/common/icon-ai.svg";

const S = {
  Wrap: styled.aside`
    display: grid;

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 24px;
      min-width: 218px;
    }
    .sidebar-text {
      color: #464f64;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;
      padding-left: 32px;
      padding: 0px 30px 0px 32px;
      gap: 24px;
      height: 64px;
    }

    .menu-item.active {
      background-color: #5899fb;
      color: white;
      padding: 0px 30px 0px 32px;
      height: 64px;
      border-radius: 8px;

      p {
        color: white;
      }

      svg {
        fill: #fff;
      }
    }

    .icon {
      width: 40px;
      height: 40px;
      stroke: #6ca7ff;
      fill: #6ca7ff;
    }
  `,
  SideMenuInner: styled.div`
    padding: 64px 32px 0px 32px;
    min-height: 100vh !important;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    .main-logo {
      margin-bottom: 72px;
      width: 198px;
      height: 31.8px;
      position: relative;
      list-style: none;
    }
  `,
  MenuItemWrapper: styled.div`
    display: flex;
    flex-direction: column;
    gap: 27px;
    cursor: pointer;
  `,
};

function MainSideMenu() {
  const router = useRouter();

  const menuItems = [
    { path: "/dashboard", label: "개요", icon: ListIcon },
    {
      path: "/farm-management",
      label: "농가관리",
      icon: FarmIcon,
    },
    {
      path: "/statistics",
      label: "파종현황",
      icon: GraphIcon,
    },
    {
      path: "/prediction",
      label: "생산량 예측",
      icon: AiIcon,
    },
    {
      path: "/setting",
      label: "설정",
      icon: SettingIcon,
    },
  ];

  return (
    <S.Wrap>
      <S.SideMenuInner>
        <li className="main-logo">
          <Image src={"/images/common/logo-data-nursery.svg"} fill alt="main-logo" />
        </li>

        <div className="sidebar">
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${router.pathname === item.path ? "active" : ""}`}
              onClick={() => router.push(item.path)}>
              <item.icon width={40} height={40} fill={"#6CA7FF"} />
              <p className="sidebar-text">{item.label}</p>
            </div>
          ))}
        </div>
      </S.SideMenuInner>
    </S.Wrap>
  );
}

export default MainSideMenu;
