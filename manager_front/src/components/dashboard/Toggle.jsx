import React, { useState } from "react";
import styled from "styled-components";

import CheckIcon from "@images/dashboard/icon-check.svg";

const S = {
  Wrap: styled.div`
    display: flex;

    .toggle-button {
      background-color: #f7f7fa;
      border: 1px solid #dcdcf0;
      padding: 8px 12px;
      font-size: 16px;
      width: 90px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      height: 40px;

      p {
        color: #737f8f;
        font-weight: 700;
        line-height: 16px;
        font-size: 14px;
      }
    }
    .left-button {
      border-radius: 5px 0 0 5px;
    }

    .right-button {
      border-radius: 0 5px 5px 0;
    }

    .toggle-button.selected {
      background-color: #fff;
      border: 1px solid #5899fb;
      color: white;
    }
  `,

  ToggleButton: styled.div``,
};

function Toggle({ isSelectedLeft, setIsSelectedLeft, isSelectedRight, setIsSelectedRight, leftToggle, rightToggle }) {
  // const [isSelectedLeft, setIsSelectedLeft] = useState(false);
  // const [isSelectedRight, setIsSelectedRight] = useState(true);

  const handleToggleLeft = () => {
    setIsSelectedLeft(true);
    setIsSelectedRight(false);
  };

  const handleToggleRight = () => {
    setIsSelectedRight(true);
    setIsSelectedLeft(false);
  };

  return (
    <S.Wrap>
      <S.ToggleButton
        onClick={handleToggleLeft}
        className={`toggle-button left-button ${isSelectedLeft ? "selected" : ""}`}>
        {isSelectedLeft && <CheckIcon width={24} height={24} />}
        <p>{leftToggle}</p>
      </S.ToggleButton>
      <S.ToggleButton
        onClick={handleToggleRight}
        className={`toggle-button right-button ${isSelectedRight ? "selected" : ""}`}>
        {isSelectedRight && <CheckIcon width={24} height={24} />}
        <p>{rightToggle}</p>
      </S.ToggleButton>
    </S.Wrap>
  );
}

export default Toggle;
