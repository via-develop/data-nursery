import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import useUpdateFarmhouse from "@src/hooks/queries/auth/useUpdateFarmhouse";
import { useDaumPostcodePopup } from "react-daum-postcode";

import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { useFarmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";

import XIcon from "@images/common/icon-x.svg";
import SearchIcon from "@images/management/search-btn.svg";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 616px;
    max-height: 100vh;
    overflow-y: auto;
    background-color: #fff;
    border-radius: 8px;
    padding: 40px;
    display: flex;
    flex-direction: column;

    .address-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .search {
      cursor: pointer;
    }

    .postmodal {
      background: rgba(0, 0, 0, 0.25);
      position: fixed;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
    }
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }

    .x-icon {
      cursor: pointer;
    }
  `,
  InputWrap: styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .input-wrap-off {
      width: 100%;
      background-color: ${({ theme }) => theme.blackWhite.white};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};

      input {
        background-color: ${({ theme }) => theme.blackWhite.white};
        border: 1px solid ${({ theme }) => theme.blackWhite.white};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
        color: ${({ theme }) => theme.basic.gray50};
      }
    }
    .input-wrap {
      width: 100%;
      background-color: ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.basic.lightSky};

      input {
        background-color: ${({ theme }) => theme.basic.lightSky};
        border: 1px solid ${({ theme }) => theme.basic.lightSky};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Bold};
        color: ${({ theme }) => theme.basic.gray60};
      }
      input::placeholder {
        color: ${({ theme }) => theme.basic.gray50};
        ${({ theme }) => theme.textStyle.h6Reguler}
      }
      input:focus-visible {
        outline: none;
      }
    }

    .title-info {
      margin-top: 8px;
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
    }
  `,
  ButtonWrap: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.primery.primery};
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    cursor: pointer;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
  ButtonWrapOff: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 40px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    margin-top: 32px;
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    cursor: default;

    p {
      color: ${({ theme }) => theme.basic.gray30};
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
};

function EditFarmModal({ editModalOpen, setEditModalOpen }) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  const [editFarmName, setEditFarmName] = useState(editModalOpen.data.data.name);
  const [editName, setEditName] = useState(editModalOpen.data.data.producer_name);
  const [editPhone, setEditPhone] = useState(editModalOpen.data.data.phone);
  const [editAddressCode, setEditAddressCode] = useState(editModalOpen.data.data.address.split("||")[0]);
  const [editAddress, setEditAddress] = useState(editModalOpen.data.data.address.split("||")[1]);
  const [editAddressData, setEditAddressData] = useState(editModalOpen.data.data.address.split("||")[2]);

  const closeModal = useCallback(() => {
    setEditModalOpen({ open: false, data: undefined });
  }, []);

  console.log("editModalOpen", editModalOpen);

  const FarmInfoSave = useCallback(() => {
    let editAddressAll = editAddressCode + "||" + editAddress + "||" + editAddressData;

    updateFarmhouseMutate({
      data: {
        id: editModalOpen.data.data.id,
        name: editName,
        producer_name: editFarmName,
        phone: editPhone,
        address: editAddressAll,
      },
    });
    console.log("아이디 : ", editModalOpen.data.data.id);
    console.log("농가명 : ", editFarmName);
    console.log("생산자명 : ", editName);
    console.log("연락처 : ", editPhone);
    console.log("주소 : ", editAddressAll);

    closeModal();
  }, [editModalOpen, editName, editFarmName]);

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleComplete = useCallback(
    (data) => {
      let fullAddress = data.address;
      let extraAddress = "";
      // let zoneCode = data.zonecode;
      setEditAddressCode(data.zonecode);
      // setEditAddress("(" + zoneCode + ") " + fullAddress);
      setEditAddress(fullAddress);

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }
    },
    [editAddressCode, editAddress],
  );

  const handleClick = useCallback(() => {
    open({ onComplete: handleComplete });
  }, []);

  const { mutate: updateFarmhouseMutate } = useUpdateFarmhouse(
    () => {
      invalidateQueries([useFarmAllListKey]);
      closeModal();
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
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
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="title">농가정보수정</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <p className="title-info">파종기 시러얼번호</p>
          <div className="input-wrap-off">
            <input value={editModalOpen.data.data.planter.serial_number} disabled />
          </div>
          <p className="title-info">육묘업 등록번호</p>
          <div className="input-wrap-off">
            <input value={editModalOpen.data.data.nursery_number} />
          </div>
          <p className="title-info">농가ID</p>
          <div className="input-wrap-off">
            <input value={editModalOpen.data.data.farm_house_id} />
          </div>
          <p className="title-info">농가명</p>
          <div className="input-wrap">
            <input
              placeholder="사업장명을 입력하세요."
              value={editFarmName}
              onChange={(e) => setEditFarmName(e.target.value)}
            />
          </div>
          <p className="title-info">생산자명</p>
          <div className="input-wrap">
            <input placeholder="이름을 입력하세요." value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <p className="title-info">연락처</p>
          <div className="input-wrap">
            <input
              placeholder="연락처를 입력하세요."
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>
          <p className="title-info">주소</p>
          <div className="address-wrap">
            <div className="input-wrap">
              <input
                placeholder="주소를 입력하세요."
                // value={editAddress}
                value={"(" + editAddressCode + ") " + editAddress}
                disabled
              />
              <div className="search" onClick={handleClick}>
                <SearchIcon width={40} height={40} />
              </div>
            </div>
            <div className="input-wrap">
              <input
                placeholder="나머지 주소를 입력하세요."
                value={editAddressData}
                onChange={(e) => setEditAddressData(e.target.value)}
              />
            </div>
          </div>
        </S.InputWrap>

        {editFarmName?.length === 0 || editName?.length === 0 || editPhone?.length === 0 ? (
          <>
            <S.ButtonWrapOff>
              <p>저장</p>
            </S.ButtonWrapOff>
          </>
        ) : (
          <>
            <S.ButtonWrap onClick={FarmInfoSave}>
              <p>저장</p>
            </S.ButtonWrap>
          </>
        )}
      </S.WrapInner>
    </S.Wrap>
  );
}

export default EditFarmModal;
