import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { useDaumPostcodePopup } from "react-daum-postcode";

import useUpdateFarmhouse from "@src/hooks/queries/auth/useUpdateFarmhouse";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
import { farmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";
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

    .input-btn-wrap {
      display: flex;
      gap: 16px;
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
      input:focus-visible {
        outline: none;
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
  PasswordChangeBtn: styled.div`
    cursor: pointer;
    height: 52px;
    width: 156px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 0px;
    border: 1px solid #5899fb;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: #5899fb;
      ${({ theme }) => theme.textStyle.h7Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.lightSky};
    }
  `,
};

function EditFarmModal({ editModalOpen, setEditModalOpen, setPage, farmList, setFarmList, setEditPWChangeModalOpen }) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  const [editNurseryNumber, setEditNurseryNumber] = useState(editModalOpen.data.nursery_number);
  const [editFarmName, setEditFarmName] = useState(editModalOpen.data.name);
  const [editName, setEditName] = useState(editModalOpen.data.producer_name);
  const [editPhone, setEditPhone] = useState(editModalOpen.data.phone);
  const [editAddressCode, setEditAddressCode] = useState(editModalOpen.data.address.split("||")[0]);
  const [editAddress, setEditAddress] = useState(editModalOpen.data.address.split("||")[1]);
  const [editAddressData, setEditAddressData] = useState(editModalOpen.data.address.split("||")[2]);

  const closeModal = useCallback(() => {
    setEditModalOpen({ open: false, data: undefined });
  }, []);

  const FarmInfoSave = useCallback(() => {
    updateFarmhouseMutate({
      data: {
        id: editModalOpen.data.id,
        nursery_number: editNurseryNumber === "" ? null : editNurseryNumber,
        name: editFarmName,
        producer_name: editName,
        phone: editPhone,
        address: editAddressCode + "||" + editAddress + "||" + editAddressData,
      },
    });
  }, [
    editModalOpen,
    editName,
    editNurseryNumber,
    editFarmName,
    editAddressCode,
    editAddress,
    editAddressData,
    farmList,
  ]);

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleComplete = useCallback(
    (data) => {
      let fullAddress = data.address;
      let extraAddress = "";
      setEditAddressCode(data.zonecode);
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
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
      closeModal();
      setFarmList([]);
      setPage(1);
      invalidateQueries([farmAllListKey]);
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

  //비밀번호 변경버튼 클릭
  const handlePasswordChangeClick = useCallback(() => {
    setEditPWChangeModalOpen({ open: true, data: editModalOpen });
  }, [editModalOpen]);

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
          <p className="title-info">파종기 시리얼번호</p>
          <div className="input-wrap-off">
            <input value={editModalOpen.data.planter.serial_number} disabled />
          </div>
          <p className="title-info">육묘업 등록번호</p>
          <div className="input-wrap">
            <input
              placeholder="육묘업등록번호를 입력하세요."
              value={editNurseryNumber}
              onChange={(e) => setEditNurseryNumber(e.target.value)}
            />
          </div>
          <p className="title-info">농가ID</p>
          <div className="input-wrap-off">
            <input value={editModalOpen.data.farm_house_id} disabled />
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
              onChange={(e) =>
                setEditPhone(e.target.value.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`))
              }
              maxLength="13"
            />
          </div>
          <p className="title-info">주소</p>
          <div className="address-wrap">
            <div className="input-wrap">
              <input placeholder="주소를 입력하세요." value={"(" + editAddressCode + ") " + editAddress} disabled />
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
          <p className="title-info">비밀번호</p>
          <div className="input-btn-wrap">
            <div className="input-wrap">
              <input value={"***********"} disabled />
            </div>
            <S.PasswordChangeBtn onClick={handlePasswordChangeClick}>
              <p>비밀번호 변경</p>
            </S.PasswordChangeBtn>
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
