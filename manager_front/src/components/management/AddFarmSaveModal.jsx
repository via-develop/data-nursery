import React, { useCallback } from "react";
import styled from "styled-components";
import { useRecoilState } from "recoil";

import { useDaumPostcodePopup } from "react-daum-postcode";
import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";
import { farmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useCreateFarmhouse from "@src/hooks/queries/auth/useCreateFarmhouse";

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
    .sub-title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold}
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

function AddFarmSaveModal({
  addFarmSerialNumber,
  nurseryRegNumber,
  setNurseryRegNumber,
  farmId,
  setFarmId,
  farmName,
  setFarmName,
  producerName,
  setProducerName,
  phoneNumber,
  setPhoneNumber,
  addressData,
  setAddressData,
  addressDetailData,
  setAddressDetailData,
  setAddFarmSaveModalOpen,
  setCreateQrcode,
  setAddFarmSerialNumber,
  qrCodeUrl,
  addressCode,
  setAddressCode,
}) {
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  const closeModal = useCallback(() => {
    setAddFarmSaveModalOpen({ open: false, serialNumber: undefined });
    setCreateQrcode(false);
    setNurseryRegNumber("");
    setFarmId("");
    setFarmName("");
    setProducerName("");
    setPhoneNumber("");
    setAddressData("");
    setAddressDetailData("");
    setAddFarmSerialNumber("");
  }, []);

  const { mutate: createFarmhouseMutate } = useCreateFarmhouse(
    () => {
      closeModal();
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 저장되었습니다.",
        okClick: null,
      });
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

  const FarmInfoSave = useCallback(() => {
    const dataURLtoFile = (qrCodeUrl, fileName) => {
      var arr = qrCodeUrl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], fileName, { type: mime });
    };

    var file = dataURLtoFile(qrCodeUrl, addFarmSerialNumber + ".png");

    createFarmhouseMutate({
      data: {
        serial_number: addFarmSerialNumber,
        nursery_number: nurseryRegNumber,
        farm_house_id: farmId,
        name: farmName,
        producer_name: producerName,
        phone: phoneNumber,
        address: addressCode + "||" + addressData.split(") ")[1] + "||" + addressDetailData,
        qrcode: file,
      },
    });
  }, [
    addFarmSerialNumber,
    nurseryRegNumber,
    farmId,
    farmName,
    producerName,
    phoneNumber,
    addressCode,
    addressData,
    addressDetailData,
  ]);

  const open = useDaumPostcodePopup("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const handleComplete = useCallback((data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let zoneCode = data.zonecode;
    setAddressCode(data.zonecode);
    setAddressData("(" + zoneCode + ") " + fullAddress);

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
  }, []);

  const handleClick = useCallback(() => {
    open({ onComplete: handleComplete });
  }, []);

  return (
    <S.Wrap>
      <S.WrapInner>
        <S.TitleWrap>
          <div className="text-wrap">
            <p className="sub-title">STEP 2</p>
            <p className="title">농가추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <p className="title-info">파종기 시리얼번호</p>
          <div className="input-wrap-off">
            <input value={addFarmSerialNumber} disabled />
          </div>
          <p className="title-info">육묘업 등록번호</p>
          <div className="input-wrap">
            <input
              placeholder="예) 제88-지역-2023-08-09"
              value={nurseryRegNumber}
              onChange={(e) => setNurseryRegNumber(e.target.value)}
            />
          </div>
          <p className="title-info">농가ID</p>
          <div className="input-wrap">
            <input placeholder="예) PF_0021350" value={farmId} onChange={(e) => setFarmId(e.target.value)} />
          </div>
          <p className="title-info">농가명</p>
          <div className="input-wrap">
            <input
              placeholder="사업장명을 입력하세요."
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
            />
          </div>
          <p className="title-info">생산자명</p>
          <div className="input-wrap">
            <input
              placeholder="이름을 입력하세요."
              value={producerName}
              onChange={(e) => setProducerName(e.target.value)}
            />
          </div>
          <p className="title-info">연락처</p>
          <div className="input-wrap">
            <input
              placeholder="연락처를 입력하세요."
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(e.target.value.replace(/[^0-9]/g, "").replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`))
              }
              maxLength="13"
            />
          </div>
          <p className="title-info">주소</p>
          <div className="address-wrap">
            <div className="input-wrap">
              <input placeholder="주소를 입력하세요." value={addressData} disabled />
              <div className="search" onClick={handleClick}>
                <SearchIcon width={40} height={40} />
              </div>
            </div>
            <div className="input-wrap">
              <input
                placeholder="나머지 주소를 입력하세요."
                value={addressDetailData}
                onChange={(e) => setAddressDetailData(e.target.value)}
              />
            </div>
          </div>
        </S.InputWrap>

        {nurseryRegNumber.length === 0 ||
        farmId.length === 0 ||
        farmName.length === 0 ||
        producerName.length === 0 ||
        phoneNumber.length === 0 ||
        addressData.length === 0 ||
        setAddressDetailData === 0 ? (
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

export default AddFarmSaveModal;
