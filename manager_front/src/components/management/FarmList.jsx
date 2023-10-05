import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { Tooltip } from "react-tooltip";

import useFarmAllList from "@src/hooks/queries/auth/useFarmAllList";
import { farmAllListKey } from "@src/utils/query-keys/AuthQueryKeys";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";
import useFarmAllListDownload from "@src/hooks/queries/auth/useFarmAllListDownload";

import colorArray from "@components/common/ListColor";

import OptionModal from "./OptionModal";
import AddFarmModal from "./AddFarmModal";
import AddFarmSaveModal from "./AddFarmSaveModal";
import QrDownloadModal from "./QrDownloadModal";
import DeleteModal from "./DeleteModal";
import EditFarmModal from "./EditFarmModal";
import EditPasswordModal from "./EditPasswordModal";

import ExcelIcon from "@images/management/excel-icon.svg";
import AddIcon from "@images/management/add-icon.svg";
import CheckBoxOff from "@images/common/check-icon-off.svg";
import CheckBoxOn from "@images/common/check-icon-on.svg";
import DownArrow from "@images/common/order-by-up-icon.svg";
import UpArrow from "@images/common/order-by-down-icon.svg";
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

  ExcelButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 24px;
    border: 1px solid #5899fb;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 4px 4px 16px 0px rgba(89, 93, 107, 0.1);

    p {
      color: #5899fb;
      ${({ theme }) => theme.textStyle.h6Bold}
    }

    &:hover {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
    }
    &:active {
      border: 1px solid ${({ theme }) => theme.basic.btnAction};
      background-color: ${({ theme }) => theme.basic.lightSky};
    }
  `,
  AddButton: styled.div`
    cursor: pointer;
    gap: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 16px 0px;
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

      svg {
        cursor: pointer;
      }

      .order-none-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 5px;
        ${({ theme }) => theme.textStyle.h3Bold}
        color: ${({ theme }) => theme.basic.gray50};
      }
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
      width: 130px;
    }
    .header-table-third {
      width: 167px;
    }
    .header-table-fourth {
      width: 267px;
    }
    .header-table-fifth {
      width: 131px;
    }
    .header-table-sixth {
      width: 182px;
    }
    .header-table-eighth {
      width: 154px;
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
      width: 163px;
    }
    .table-eighth {
      width: 59px;
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

    svg {
      cursor: pointer;
    }

    .farm_number {
      /* width: 150px; */
      width: 187px;
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
      display: block !important;
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
  const invalidateQueries = useInvalidateQueries();
  const [isFarmhouseIdOrder, setIsFarmHouseIdOrder] = useState(1);
  const [isNameOrderBy, setIsNameOrderBy] = useState(2);
  const [isStateOrderBy, setIsStateOrderBy] = useState(2);

  // 페이지네이션
  const [page, setPage] = useState(1);

  //농가목록 데이터
  const [farmList, setFarmList] = useState([]);

  const [isAddDataClick, setIsAddDataClick] = useState(false); // 더보기 클릭 여부

  const { data: farmhouseList } = useFarmAllList({
    farmhouseIdOrder: isFarmhouseIdOrder,
    nameOrder: isNameOrderBy,
    statusOrder: isStateOrderBy,
    page: page,
    size: 8,
    successFn: (res) => {
      if (isAddDataClick) {
        setFarmList((prev) => [...prev, ...res.farm_houses]);
      } else {
        setFarmList(res.farm_houses);
        setIsAddDataClick(false);
      }
    },
    errorFn: (err) => {
      alert(err);
    },
  });

  const { data: farmhouseListDownload } = useFarmAllListDownload({
    successFn: () => {},
    errorFn: (err) => {
      alert(err);
    },
  });

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
    deleteId: undefined,
  });

  // 수정 모달
  const [editModalOpen, setEditModalOpen] = useState({
    open: false,
    data: undefined,
  });

  //비밀번호 변경 모달
  const [editPwChangeModalOpen, setEditPWChangeModalOpen] = useState({ open: false, data: undefined });

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

  // 엑셀 다운로드 버튼
  const handleExcelClick = useCallback(() => {
    try {
      if (farmhouseListDownload === undefined) {
        return;
      }
      const url = window.URL.createObjectURL(new Blob([farmhouseListDownload.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "farmhouse_list.csv");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("엑셀 내려받기에 실패하였습니다. 잠시 후 다시 시도해주세요.");
    }
  }, [farmhouseListDownload]);

  const [checkArray, setCheckArray] = useState([]);

  // 선택삭제 클릭
  const handelSelectDeleteClick = useCallback(() => {
    setDeleteModalOpen({ open: true, deleteId: checkArray.join("||") });
  }, [checkArray]);

  // 체크박스 전제 선택 및 전체 해제
  const toggleAll = useCallback(
    (isAllCheck) => {
      if (isAllCheck) {
        // 전부 체크되어 있는 경우
        setCheckArray([]);
      } else {
        // 전부 체크 안되어 있는 경우
        const allCheckArray = [];

        farmList.map((farmHouse) => {
          allCheckArray.push(farmHouse.id);
        });

        setCheckArray(allCheckArray);
      }
    },
    [farmList],
  );

  const toggleItem = useCallback(
    (isCheck, id) => {
      if (isCheck) {
        // 체크된 항목 클릭 시
        setCheckArray(checkArray.filter((checkId) => checkId !== id));
      } else {
        // 미체크된 항목 클릭 시
        setCheckArray((prev) => [...prev, id]);
      }
    },
    [checkArray],
  );

  console.log("farmList", farmList);

  return (
    <S.Wrap>
      <S.InfoBlock>
        <div className="info-wrap">
          <div className="text-wrap">
            <p className="info-title">전체 농가 목록</p>
            <p className="info-sub">농가 목록 추가, 수정, 삭제, QR코드 관리</p>
          </div>
          <div className="button-wrap">
            <S.ExcelButton onClick={handleExcelClick}>
              <ExcelIcon width={20} height={25} />
              <p>엑셀 내려받기</p>
            </S.ExcelButton>
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
            {checkArray.length !== 0 && checkArray.length === farmList.length ? (
              <CheckBoxOn
                width={24}
                height={24}
                onClick={() => {
                  toggleAll(true);
                }}
              />
            ) : (
              <CheckBoxOff
                width={24}
                height={24}
                onClick={() => {
                  toggleAll(false);
                }}
              />
            )}
          </div>
          {checkArray.length === 0 ? (
            <>
              <p className="header-table">파종기 S/N</p>
              <div className="header-table-third arrow-wrap">
                <p>농가 ID</p>
                {isFarmhouseIdOrder === 0 && (
                  <DownArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(1);
                      setIsNameOrderBy(2);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isFarmhouseIdOrder === 1 && (
                  <UpArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsNameOrderBy(2);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isFarmhouseIdOrder === 2 && (
                  <p
                    className="order-none-icon"
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(0);
                      setIsNameOrderBy(2);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}>
                    -
                  </p>
                )}
              </div>
              <div className="header-table-third arrow-wrap">
                <p>농가명</p>
                {isNameOrderBy === 0 && (
                  <DownArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsNameOrderBy(1);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isNameOrderBy === 1 && (
                  <UpArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsNameOrderBy(2);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isNameOrderBy === 2 && (
                  <p
                    className="order-none-icon"
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsNameOrderBy(0);
                      setIsStateOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}>
                    -
                  </p>
                )}
              </div>
              <p className="header-table-fourth">생산자명</p>
              <p className="header-table-fifth">육묘업등록번호</p>
              <p className="header-table-sixth">주소</p>
              <p className="header-table">연락처</p>
              <div className="header-table-eighth arrow-wrap">
                <p>상태</p>
                {isStateOrderBy === 0 && (
                  <DownArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsStateOrderBy(1);
                      setIsNameOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isStateOrderBy === 1 && (
                  <UpArrow
                    width={24}
                    height={24}
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsStateOrderBy(2);
                      setIsNameOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}
                  />
                )}
                {isStateOrderBy === 2 && (
                  <p
                    className="order-none-icon"
                    onClick={() => {
                      setFarmList([]);
                      setPage(1);
                      setIsFarmHouseIdOrder(2);
                      setIsStateOrderBy(0);
                      setIsNameOrderBy(2);
                      invalidateQueries([farmAllListKey]);
                    }}>
                    -
                  </p>
                )}
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
        {farmList?.length === 0 ? (
          <S.EmptyData>
            <FarmIcon width={56} height={56} />
            <p>등록된 농가가 없습니다.</p>
          </S.EmptyData>
        ) : (
          farmList.map((data, index) => {
            return (
              <S.ListBlock
                key={`farmHouse${data.id}`}
                className={`table-row ${checkArray.includes(data.id) ? "selected" : ""}`}>
                {checkArray.includes(data.id) ? (
                  <CheckBoxOn width={24} height={24} onClick={() => toggleItem(true, data.id)} />
                ) : (
                  <CheckBoxOff width={24} height={24} onClick={() => toggleItem(false, data.id)} />
                )}
                <p className="table-first serial_number">{data.planter.serial_number}</p>
                <p className="table-second farm_id">{data.farm_house_id}</p>
                <div className="table-third farm_name_wrap">
                  <div className="farm-name-first" style={{ backgroundColor: colorArray[data.id % 20] }}>
                    {data?.name?.slice(0, 1)}
                  </div>
                  <p className="farm_name">{data?.name}</p>
                </div>
                <p className="table-text name">{data?.producer_name}</p>
                <p className="table-text farm_number">
                  {data?.nursery_number === null ? <p>-</p> : data?.nursery_number}
                </p>
                <p className="table-text address" id={`address${index}`}>
                  {data?.address.split("||")[1] + " " + data?.address.split("||")[2]}
                </p>
                <p className="table-text phone">{data?.phone}</p>
                {data?.last_planter_status?.status === "ON" ? (
                  <p className="table-eighth status-on">{data?.last_planter_status.status}</p>
                ) : (
                  <p className="table-eighth status-off">{data?.last_planter_status.status}</p>
                )}

                <div className="option-modal-wrap">
                  <div
                    className="option-dot"
                    onClick={() => {
                      handleOptionModalClick(index, data);
                    }}>
                    <OptionDot width={40} height={32} />
                  </div>
                  {index === optionModalOpen.index && (
                    <OptionModal
                      optionModalOpen={optionModalOpen}
                      setOptionModalOpen={setOptionModalOpen}
                      setQrDownloadModalOpen={setQrDownloadModalOpen}
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
                        {"(" +
                          data?.address.split("||")[0] +
                          ") " +
                          data?.address.split("||")[1] +
                          " " +
                          data?.address.split("||")[2]}
                      </p>
                    </div>
                  }
                />
              </S.ListBlock>
            );
          })
        )}
        {farmhouseList?.total !== 0 && farmList.length !== farmhouseList?.total && farmList?.length !== 0 && (
          <S.ButtonWrap>
            <S.MoreButton
              onClick={() => {
                setIsAddDataClick(true);
                setPage(page + 1);
              }}>
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
            addressCode={addressCode}
            setAddressCode={setAddressCode}
          />
        </div>
      )}
      {/* QR 다운로드 모달 */}
      {qrDownloadModalOpen.open && (
        <div className="modal-wrap">
          <QrDownloadModal qrDownloadModalOpen={qrDownloadModalOpen} setQrDownloadModalOpen={setQrDownloadModalOpen} />
        </div>
      )}

      {/* 삭제 모달 */}
      {deleteModalOpen.open && (
        <div className="modal-wrap">
          <DeleteModal
            setDeleteModalOpen={setDeleteModalOpen}
            deleteModalOpen={deleteModalOpen}
            checkArray={checkArray}
            setPage={setPage}
            farmList={farmList}
            setFarmList={setFarmList}
          />
        </div>
      )}

      {/* 수정모달 */}
      {editModalOpen.open && (
        <div className="modal-wrap">
          <EditFarmModal
            editModalOpen={editModalOpen}
            setEditModalOpen={setEditModalOpen}
            setPage={setPage}
            farmList={farmList}
            setFarmList={setFarmList}
            setEditPWChangeModalOpen={setEditPWChangeModalOpen}
          />
        </div>
      )}

      {editPwChangeModalOpen.open && (
        <div className="modal-wrap">
          <EditPasswordModal editModalOpen={editModalOpen} setEditPWChangeModalOpen={setEditPWChangeModalOpen} />
        </div>
      )}
    </S.Wrap>
  );
}

export default FarmList;
