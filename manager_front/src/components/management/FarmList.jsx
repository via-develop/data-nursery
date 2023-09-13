import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import useFarmAllList from "@src/hooks/queries/auth/useFarmAllList";

import colorArray from "@components/common/ListColor";

// import DaumPostcode from "react-daum-postcode";
import OptionModal from "./OptionModal";
import AddFarmModal from "./AddFarmModal";
import AddFarmSaveModal from "./AddFarmSaveModal";
import QrDownloadModal from "./QrDownloadModal";
import DeleteModal from "./DeleteModal";
import EditFarmModal from "./EditFarmModal";

import ExcelIcon from "@images/management/excel-icon.svg";
import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import UpArrow from "@images/common/order-by-up-icon.svg";
import DownArrow from "@images/common/order-by-down-icon.svg";
import OptionDot from "@images/common/option-dot-icon.svg";
import FarmIcon from "@images/management/icon-farm.svg";
import DeleteIcon from "@images/setting/icon-delete.svg";

const S = {
  Wrap: styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;

    .modal-wrap {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000040;
      z-index: 1;
    }
  `,
  InfoBlock: styled.div`
    background-color: #fff;
    padding: 32px 56px;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    .info-wrap {
      display: flex;
      justify-content: space-between;
    }

    .text-wrap {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .info-title {
      ${({ theme }) => theme.textStyle.h4Bold}
      color:${({ theme }) => theme.basic.deepBlue}
    }

    .info-sub {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray50}
    }

    .button-wrap {
      display: flex;
      gap: 16px;
    }
  `,

  // ExcelButton: styled.div`
  //   cursor: pointer;
  //   gap: 16px;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  //   padding: 16px 24px;
  //   border: 1px solid #5899fb;
  //   background-color: #fff;
  //   border-radius: 8px;
  //   box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

  //   p {
  //     color: #5899fb;
  //     ${({ theme }) => theme.textStyle.h6Bold}
  //   }

  //   &:hover {
  //     border: 1px solid ${({ theme }) => theme.basic.btnAction};
  //   }
  //   &:active {
  //     border: 1px solid ${({ theme }) => theme.basic.btnAction};
  //     background-color: ${({ theme }) => theme.basic.lightSky};
  //   }
  // `,
  AddButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border-radius: 8px;
    background-color: #5899fb;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border: 1px solid ${({ theme }) => theme.primery.primery};

    width: 172px;

    p {
      color: #fff;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.btnAction};
    }
  `,
  ContentList: styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;

    .list-table-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 32px 6px 24px;
      height: 52px;
    }
    p {
      ${({ theme }) => theme.textStyle.h7Reguler};
      color: ${({ theme }) => theme.basic.gray60};
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .arrow-wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .icon-wrap {
      cursor: pointer;
      align-items: center;
      display: flex;
    }

    .selected {
      border: 1px solid ${({ theme }) => theme.primery.primery};
    }

    .btn-wrap {
      width: 100%;
    }

    .header-table {
      width: 120px;
    }
    .header-table-second {
      width: 140px;
    }
    .header-table-third {
      width: 200px;
    }
    .header-table-fourth {
      width: 130px;
    }
    .header-table-eighth {
      width: 160px;
    }

    .table-first {
      width: 100px;
    }
    .table-second {
      width: 150px;
    }
    .table-third {
      width: 200px;
    }
    .table-text {
      width: 120px;
    }
    .table-eighth {
      width: 90px;
    }

    .address {
      display: block !important;
    }
  `,

  ListBlock: styled.div`
    display: flex;
    justify-content: space-between;
    padding: 16px 32px 16px 24px;
    height: 68px;
    background-color: #fff;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);
    border: 1px solid ${({ theme }) => theme.basic.recOutline};
    border-radius: 8px;
    align-items: center;
    margin-bottom: 16px;

    p {
      ${({ theme }) => theme.textStyle.h7Bold};
      color: ${({ theme }) => theme.basic.gray50};
    }
    .farm_number {
      width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .farm_name_wrap {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .farm-name-first {
      /* background-color: #79cec8; */
      border-radius: 30px;
      padding: 8px;
      color: #fff;
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;
      display: flex;
    }
    .farm_name {
      width: 132px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .address {
      width: 110px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .option-dot {
      cursor: pointer;
    }
    .status-on {
      color: ${({ theme }) => theme.primery.primery};
    }
    .status-off {
      color: ${({ theme }) => theme.basic.gray30};
    }

    .option-modal-wrap {
      position: relative;
    }
  `,

  ButtonWrap: styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  MoreButton: styled.div`
    cursor: pointer;
    border-radius: 8px;
    width: 280px;
    padding: 16px 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${({ theme }) => theme.basic.whiteGray};
    border: 1px solid ${({ theme }) => theme.basic.recOutline};

    p {
      ${({ theme }) => theme.textStyle.h6Reguler}
      color:${({ theme }) => theme.basic.gray60}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.recOutline};
    }
  `,
  AddressTooltip: styled(Tooltip)`
    border-radius: 8px !important;
    background-color: ${({ theme }) => theme.basic.gray60} !important;
    border: 1px solid ${({ theme }) => theme.basic.gray60} !important;
    padding: 8px 24px;

    p {
      color: #fff !important;
      ${({ theme }) => theme.textStyle.h7Reguler}
    }
  `,
  EmptyData: styled.div`
    margin-top: 168px;
    gap: 14px;
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;

    p {
      color: ${({ theme }) => theme.basic.gray50};
      ${({ theme }) => theme.textStyle.h5Reguler}
    }
  `,
  SelectDeleteBtn: styled.div`
    border-radius: 8px;
    padding: 8px 12px;
    background-color: ${({ theme }) => theme.primery.primery};
    display: flex;
    gap: 6px;
    height: 32px;
    align-items: center;
    cursor: pointer;
    width: fit-content;
    margin-left: 16px;

    p {
      color: ${({ theme }) => theme.blackWhite.white} !important;
      ${({ theme }) => theme.textStyle.h7Bold};
    }
  `,
};

function FarmList() {
  const [isNameOrderBy, setIsNameOrderBy] = useState(0);
  const [isStateOrderBy, setIsStateOrderBy] = useState(0);

    // 농가명 정렬
    const sortByFarmName = useCallback(() => {
      if(isNameOrderBy === 0){
        setIsNameOrderBy(1);
      }else{
        setIsNameOrderBy(0);
      }
    }, [isNameOrderBy]);
  
    // 상태 정렬
    const sortByStatus = useCallback(() => {
      if(isStateOrderBy === 0){
        setIsStateOrderBy(1);
      }else{
        setIsStateOrderBy(0);
      }
    }, [isStateOrderBy]);

  const [isAddDataClick, setIsAddDataClick] = useState(false); // 더보기 클릭 여부

  const { data: farmhouseList } = useFarmAllList({
    nameOrder: isNameOrderBy,
    statusOrder: isStateOrderBy,
    page: 1,
    size: 15,
    successFn: () => {},
    errorFn: (err) => {
      console.log("!!err", err);
    },
  });

  console.log("farmhouseList", farmhouseList);

  // 농가추가시 작성하는 시리얼넘버
  const [addFarmSerialNumber, setAddFarmSerialNumber] = useState("");
  // 농가추가시 필요한 데이터
  const [nurseryRegNumber, setNurseryRegNumber] = useState("");
  const [farmId, setFarmId] = useState("");
  const [farmName, setFarmName] = useState("");
  const [producerName, setProducerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressData, setAddressData] = useState("");
  const [addressDetailData, setAddressDetailData] = useState("");
  const [addressCode, setAddressCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [nameOrder,setNameOrder] = useState(0)

  // ...클릭시 나오는 모달
  const [optionModalOpen, setOptionModalOpen] = useState({
    open: false,
    index: undefined,
    data: undefined,
  });
  //농가 추가 모달
  const [addFarmModalOpen, setAddFarmModalOpen] = useState(false);
  //농가 추가 step2 모달
  const [addFarmSaveModalOpen, setAddFarmSaveModalOpen] = useState({
    open: false,
    serialNumber: undefined,
  });
  //QR코드 생성 보여주는 부분
  const [createQrcode, setCreateQrcode] = useState(false);

  //QR 다운로드 모달
  const [qrDownloadModalOpen, setQrDownloadModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 삭제 모달
  const [deleteModalOpen, setDeleteModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // 수정 모달
  const [editModalOpen, setEditModalOpen] = useState({
    open: false,
    data: undefined,
  });

  // : 눌렀을때 나오는 모달
  const handleOptionModalClick = useCallback(
    (index, data) => {
      if (optionModalOpen.open === true) {
        setOptionModalOpen({ open: false, index: undefined, data: undefined });
      } else if (optionModalOpen.open === false) {
        setOptionModalOpen({ open: true, index: index, data: data });
      }
    },
    [optionModalOpen],
  );

  // 농가추가 모달
  const handleAddFarmModalClick = useCallback(() => {
    setAddFarmModalOpen(true);
  }, [addFarmModalOpen]);

  // 농가목록 데이터
  // const listData = useMemo(() => {
  //   const array = [];
  //   farmhouseList?.farm_houses?.map((data) => {
  //     array.push({
  //       id: data?.id,
  //       serial_number: data?.planter?.serial_number,
  //       farm_id: data?.farm_house_id,
  //       farm_name: data?.name,
  //       name: data?.producer_name,
  //       farm_number: data?.nursery_number,
  //       address_code: data?.address.split("||")[0],
  //       address: data?.address.split("||")[1],
  //       address_detail: data?.address.split("||")[2],
  //       phone: data?.phone,
  //       status: data?.last_planter_status?.status,
  //       qr_image: data?.planter?.qrcode,
  //     });
  //   });
  //   return array;
  // }, []);

  // console.log("farmhouseList", farmhouseList);
  // console.log("listData", listData);

  //정렬 토글
  const [isFarmNameAscending, setIsFarmNameAscending] = useState(true);
  const [isStatusAscending, setIsStatusAscending] = useState(true);



  console.log("isNameOrderBy",isNameOrderBy)
  console.log("isStateOrderBy",isStateOrderBy)

  // // 엑셀 다운로드 버튼
  // const handleExcelClick = useCallback(() => {
  //   alert("엑셀 다운로드 클릭");
  // }, []);

  // 농가목록 더보기
  const listMoreView = useCallback(() => {
    alert("더보기 버튼 구현중");
  }, []);

  const [selectAll, setSelectAll] = useState(false);
  // const [isChecked, setIsChecked] = useState([]);
  // const [isChecked, setIsChecked] = useState(farmhouseList?.farm_houses?.map(() => false));
  const [checkArray, setCheckArray] = useState([]);

  // useEffect(() => {
  //   if (!!listData) {
  //     const dateArr = [];
  //     listData.map(() => {
  //       return dateArr.push(false);
  //     });
  //     setIsChecked(dateArr);
  //   }
  // }, [farmhouseList]);

  // const toggleItem = (index) => {
  //   const updatedIsCheckedArray = [...isChecked];
  //   updatedIsCheckedArray[index] = !updatedIsCheckedArray[index];
  //   setIsChecked(updatedIsCheckedArray);

  //   // 모든 항목이 체크되었는지 확인
  //   const allChecked = updatedIsCheckedArray.every((checked) => checked);

  //   // 모든 항목이 체크되었다면 전체 선택 체크박스를 true로 설정
  //   // 그렇지 않다면 전체 선택 체크박스를 false로 설정
  //   setSelectAll(allChecked);

  //   // const selectedItemId = listData[index].id;

  //   if (updatedIsCheckedArray[index]) {
  //     setCheckArray((prevArray) => [...prevArray, selectedItemId]);
  //   } else {
  //     setCheckArray((prevArray) => prevArray.filter((id) => id !== selectedItemId));
  //   }
  // };

  // const toggleAll = () => {
  //   const allChecked = !selectAll;

  //   // 모든 항목을 전부 선택 또는 해제
  //   const updatedIsCheckedArray = isChecked.map(() => allChecked);

  //   setIsChecked(updatedIsCheckedArray);
  //   setSelectAll(allChecked);

  //   // const selectedIds = listData.map((item) => item.id);

  //   if (allChecked) {
  //     setCheckArray(selectedIds);
  //   } else {
  //     setCheckArray([]);
  //   }
  // };

  // 선택삭제 클릭
  const handelSelectDeleteClick = useCallback(() => {
    alert(checkArray);
    setDeleteModalOpen({ open: true, data: { data: { id: checkArray } } });
  }, [checkArray]);

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="info-wrap">
          <div className="text-wrap">
            <p className="info-title">전체 농가 목록</p>
            <p className="info-sub">농가 목록 추가, 수정, 삭제, QR코드 관리</p>
          </div>
          <div className="button-wrap">
            {/* <S.ExcelButton onClick={handleExcelClick}>
              <ExcelIcon width={20} height={25} />
              <p>엑셀 내려받기</p>
            </S.ExcelButton> */}
            <S.AddButton onClick={handleAddFarmModalClick}>
              <AddIcon width={24} height={24} />
              <p>농가 추가</p>
            </S.AddButton>
          </div>
        </div>
      </S.InfoBlock>
      <S.ContentList>
        <div className="list-table-head">
          <div>
            <CheckBoxOff width={24} height={24} />
            {/* <label>
              <input type="checkbox" checked={selectAll} onChange={toggleAll} style={{ display: "none" }} />
              <div>{selectAll ? <CheckBoxOn width={24} height={24} /> : <CheckBoxOff width={24} height={24} />}</div>
            </label> */}
          </div>
          {checkArray.length === 0 ? (
            <>
              <p className="header-table">파종기 S/N</p>
              <p className="header-table-second">농가 ID</p>
              <div className="header-table-third arrow-wrap">
                <p>농가명</p>
                <div className="icon-wrap" onClick={sortByFarmName}>
                  {isNameOrderBy ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
              <p className="header-table-fourth">생산자명</p>
              <p className="header-table">육묘업등록번호</p>
              <p className="header-table">주소</p>
              <p className="header-table">연락처</p>
              <div className="header-table-eighth arrow-wrap">
                <p>상태</p>
                <div className="icon-wrap" onClick={sortByStatus}>
                  {isStateOrderBy ? <UpArrow width={24} height={24} /> : <DownArrow width={24} height={24} />}
                </div>
              </div>
              <p></p>
            </>
          ) : (
            <>
              <div className="btn-wrap">
                <S.SelectDeleteBtn onClick={handelSelectDeleteClick}>
                  <DeleteIcon width={12} height={12} />
                  <p>선택삭제</p>
                </S.SelectDeleteBtn>
              </div>
            </>
          )}
        </div>
        {farmhouseList?.farm_houses.length === 0 ? (
          <S.EmptyData>
            <FarmIcon width={56} height={56} />
            <p>등록된 농가가 없습니다.</p>
          </S.EmptyData>
        ) : (
          farmhouseList?.farm_houses.map((data, index, item) => {
            return (
              // <S.ListBlock key={`map${index}`} className={`table-row ${isChecked[index] ? "selected" : ""}`}>
              <S.ListBlock key={`map${index}`} className={`table-row}`}>
                {/* <label key={item.id} className="table-row">
                  <input
                    type="checkbox"
                    checked={isChecked[index]}
                    onChange={() => toggleItem(index)}
                    style={{ display: "none" }}
                  />
                  <div>
                    {isChecked[index] ? <CheckBoxOn width={24} height={24} /> : <CheckBoxOff width={24} height={24} />}
                  </div>
                  <div>{item.name}</div>
                </label> */}
                <CheckBoxOff width={24} height={24} />
                <p className="table-first serial_number">{data.planter.serial_number}</p>
                <p className="table-second farm_id">{data.farm_house_id}</p>
                <div className="table-third farm_name_wrap">
                  <div
                    className="farm-name-first"
                    style={{ backgroundColor: colorArray[index % farmhouseList?.farm_houses.length] }}>
                    {data?.name?.slice(0, 1)}
                  </div>
                  <p className="farm_name">{data?.name}</p>
                </div>
                <p className="table-text name">{data?.producer_name}</p>
                <p className="table-text farm_number">{data?.nursery_number}</p>
                <p className="table-text address" id={`address${index}`}>
                  {data?.address.split("||")[1] + data?.address.split("||")[2]}
                </p>
                <p className="table-text phone">{data?.phone}</p>
                {data?.status === "ON" ? (
                  <p className="table-eighth status-on">{data?.last_planter_status.status}</p>
                ) : (
                  <p className="table-eighth status-off">{data?.last_planter_status.status}</p>
                )}

                <div className="option-modal-wrap">
                  <div
                    className="option-dot"
                    onClick={() => {
                      handleOptionModalClick(index, data);
                      setQrDownloadModalOpen({
                        open: false,
                        data: data,
                      });
                      setDeleteModalOpen({
                        open: false,
                        data: data,
                      });
                    }}>
                    <OptionDot width={40} height={32} />
                  </div>
                  {index === optionModalOpen.index && (
                    <OptionModal
                      optionModalOpen={optionModalOpen}
                      setOptionModalOpen={setOptionModalOpen}
                      qrDownloadModalOpen={qrDownloadModalOpen}
                      setQrDownloadModalOpen={setQrDownloadModalOpen}
                      deleteModalOpen={deleteModalOpen}
                      setDeleteModalOpen={setDeleteModalOpen}
                      setEditModalOpen={setEditModalOpen}
                    />
                  )}
                </div>

                <S.AddressTooltip
                  anchorId={`address${index}`}
                  place="bottom"
                  noArrow
                  content={
                    <div className="text-wrap">
                      <p>
                        {/* ({data?.address_code}) */}
                        {"(" + data?.address.split("||")[0] + ") " + data?.address.split("||")[1]}
                      </p>
                    </div>
                  }
                />
              </S.ListBlock>
            );
          })
        )}
        {farmhouseList?.farm_houses.length !== 0 && (
          <S.ButtonWrap>
            <S.MoreButton onClick={listMoreView}>
              <p>더보기</p>
            </S.MoreButton>
          </S.ButtonWrap>
        )}
      </S.ContentList>

      {/* 농가추가 모달 */}
      {addFarmModalOpen && (
        <div className="modal-wrap">
          <AddFarmModal
            setAddFarmModalOpen={setAddFarmModalOpen}
            addFarmSerialNumber={addFarmSerialNumber}
            setAddFarmSerialNumber={setAddFarmSerialNumber}
            createQrcode={createQrcode}
            setCreateQrcode={setCreateQrcode}
            setAddFarmSaveModalOpen={setAddFarmSaveModalOpen}
            qrCodeUrl={qrCodeUrl}
            setQrCodeUrl={setQrCodeUrl}
          />
        </div>
      )}
      {/* 농가추가 step2 모달 */}
      {addFarmSaveModalOpen.open && (
        <div className="modal-wrap">
          <AddFarmSaveModal
            setAddFarmSaveModalOpen={setAddFarmSaveModalOpen}
            addFarmSerialNumber={addFarmSerialNumber}
            addFarmSaveModalOpen={addFarmSaveModalOpen}
            nurseryRegNumber={nurseryRegNumber}
            setNurseryRegNumber={setNurseryRegNumber}
            farmId={farmId}
            setFarmId={setFarmId}
            farmName={farmName}
            setFarmName={setFarmName}
            producerName={producerName}
            setProducerName={setProducerName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            addressData={addressData}
            addressDetailData={addressDetailData}
            setAddressData={setAddressData}
            setAddressDetailData={setAddressDetailData}
            setCreateQrcode={setCreateQrcode}
            setAddFarmSerialNumber={setAddFarmSerialNumber}
            qrCodeUrl={qrCodeUrl}
            setQrCodeUrl={setQrCodeUrl}
            addressCode={addressCode}
            setAddressCode={setAddressCode}
          />
        </div>
      )}
      {/* QR 다운로드 모달 */}
      {qrDownloadModalOpen.open && (
        <div className="modal-wrap">
          <QrDownloadModal
            qrDownloadModalOpen={qrDownloadModalOpen}
            setQrDownloadModalOpen={setQrDownloadModalOpen}
            optionModalOpen={optionModalOpen}
          />
        </div>
      )}

      {/* 삭제 모달 */}
      {deleteModalOpen.open && (
        <div className="modal-wrap">
          <DeleteModal
            setDeleteModalOpen={setDeleteModalOpen}
            deleteModalOpen={deleteModalOpen}
            checkArray={checkArray}
          />
        </div>
      )}

      {/* 수정모달 */}
      {editModalOpen.open && (
        <div className="modal-wrap">
          <EditFarmModal editModalOpen={editModalOpen} setEditModalOpen={setEditModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default FarmList;
