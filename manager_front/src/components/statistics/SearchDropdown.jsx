import React from "react";
import styled from "styled-components";

import SearchIcon from "@images/statistics/icon-search.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";

const S = {
  Dropdown: styled.div`
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    background-color: ${({ theme }) => theme.basic.whiteGray};
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    position: absolute;
    top: 36px;
    max-height: 350px;
    width: ${(props) => props.width};

    .input-wrap {
      border-radius: 4px;
      padding: 6px 8px 6px 12px;
      height: 30px;
      background-color: ${({ theme }) => theme.blackWhite.white};
      display: flex;
      gap: 6px;
      align-items: center;

      input {
        border: none;
        width: 100%;
      }
      input:focus-visible {
        outline: none;
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray60};
        ${({ theme }) => theme.textStyle.h7Reguler};
      }
    }

    .drop-down-list-wrap {
      max-height: 272px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .drop-down-list {
      display: flex;
      padding: 4px;
      gap: 8px;
      border-radius: 4px;
      align-items: center;
      cursor: pointer;
    }

    .data-text {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h7Reguler};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block !important;
      flex: 1;
    }

    .drop-down-list:hover {
      background-color: ${({ theme }) => theme.basic.gray20};
    }
  `,
  DotBorder: styled.div`
    border: 1px dashed ${({ theme }) => theme.basic.recOutline};
    height: 1px;
    width: 100%;
  `,
};

function SearchDropdown({ width, type, dataList, selectData, searchText, setSearchText, dataClick }) {
  return (
    <S.Dropdown width={width}>
      <div className="input-wrap">
        <SearchIcon width={18} height={18} />
        <input
          placeholder="검색어 입력"
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
          }}
        />
      </div>
      <S.DotBorder />
      <div className="drop-down-list-wrap">
        {dataList?.map((data, index) => {
          return (
            <div
              className="drop-down-list"
              key={`${type + index}`}
              onClick={() => {
                dataClick(selectData.toString().split("||").includes(data.toString()), type, data.toString());
              }}>
              {selectData.toString().split("||").includes(data.toString()) ? (
                <CheckBoxOn width={24} height={24} />
              ) : (
                <CheckBoxOff width={24} height={24} />
              )}
              <p className="data-text">{data}</p>
            </div>
          );
        })}
      </div>
    </S.Dropdown>
  );
}

export default SearchDropdown;
