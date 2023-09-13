import React, { useCallback, useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { ChromePicker } from "react-color";
import { useRecoilState } from "recoil";

import useCreateCrop from "@src/hooks/queries/crop/useCreateCrop";
import useInvalidateQueries from "@src/hooks/queries/common/useInvalidateQueries";

import cropColorArray from "@components/common/CropListColor";

import XIcon from "@images/common/icon-x.svg";
import CropsNoIcon from "@images/setting/crops-no-img.svg";
import RainbowIcon from "@images/setting/rainbow-color.svg";
import CheckRainbowIcon from "@images/setting/check-rainbow-icon.svg";
import { cropListKey } from "@src/utils/query-keys/CropQueryKeys";
import { isDefaultAlertShowState } from "@src/states/isDefaultAlertShowState";

const S = {
  Wrap: styled.div`
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    display: flex;
  `,
  WrapInner: styled.div`
    width: 470px;
    background-color: #fff;
    max-height: 100vh;
    overflow-y: auto;
    border-radius: 8px;
    padding: 40px;
    display: flex;
    flex-direction: column;
  `,
  TitleWrap: styled.div`
    display: flex;
    justify-content: space-between;

    .text-wrap {
      display: flex;
      flex-direction: column;
    }
    .title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h3Bold}
    }
    .x-icon {
      cursor: pointer;
    }
  `,
  TextWrap: styled.div`
    display: flex;
    justify-content: space-between;
  `,

  ImgWrap: styled.div`
    width: 100%;
    justify-content: center;
    align-items: center;
    display: flex;

    .img-inner {
      cursor: pointer;
      border-radius: 100px;
      width: 200px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .yes-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100px;
    }
  `,
  InputWrap: styled.div`
    display: flex;
    margin-top: 40px;
    gap: 16px;
    flex-direction: column;

    .input-wrap {
      width: 100%;
      background-color: ${({ theme }) => theme.basic.lightSky};
      padding: 6px 8px 6px 16px;
      justify-content: start;
      align-items: center;
      height: 52px;
      display: flex;
      border-radius: 8px;
      margin-bottom: 16px;

      input {
        background-color: ${({ theme }) => theme.basic.lightSky};
        border: 1px solid ${({ theme }) => theme.basic.lightSky};
        width: 100%;
        ${({ theme }) => theme.textStyle.h6Reguler};
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

    .input-title {
      color: ${({ theme }) => theme.basic.gray60};
      ${({ theme }) => theme.textStyle.h6Bold};
      margin-bottom: 8px;
    }

    .file-input {
      display: none;
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
    border: 1px solid ${({ theme }) => theme.primery.primery};

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

    p {
      color: ${({ theme }) => theme.basic.gray30};
      ${({ theme }) => theme.textStyle.h5Bold}
    }
  `,
  Border: styled.div`
    width: 100%;
    border-bottom: 0.5px solid ${({ theme }) => theme.basic.recOutline};
    height: 0.5px;
  `,
  ColorWrap: styled.div`
    display: flex;
    gap: 16px;
    flex-direction: column;
    padding: 8px 2px;

    .color-check-wrap-rainbow {
      margin-left: 6px;
      margin-top: 5px;
      margin-right: 3px;
      border-radius: 30px;
      cursor: pointer;
    }
  `,
  ColorPalette: styled.div`
    margin-top: -19px;
    display: flex;
    justify-content: space-around;

    .chrome-picker {
      /* height: 363px; */
    }
    /* height: 238px; */

    /* position: absolute;
    top: 180px;
    left: 55px; */
  `,
};

function AddCropsModal({ addCropsModalOpen, setAddCropsModalOpen }) {
  const fileInputRef = useRef(null);
  const invalidateQueries = useInvalidateQueries();
  const [isDefaultAlertShow, setIsDefaultAlertShowState] = useRecoilState(isDefaultAlertShowState);

  //작물 추가 정보
  const [cropsName, setCropsName] = useState("");

  //작물 이미지 추가
  const [image, setImage] = useState(null);
  const [imageView, setImageView] = useState(""); // 메뉴 이미지 보여주기 위해 사용

  //선택한 색상
  const [selectedColor, setSelectedColor] = useState("#929FA6");

  const [isOpen, setIsOpen] = useState(false);

  // 이미지 미리보기 클릭 시 파일 선택 창 열기
  const handleImagePreviewClick = () => {
    fileInputRef.current.click();
  };

  // 등록한 작물 이미지 확인하기 위함
  const encodeFileToBase64 = useCallback((fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);

    return new Promise((resolve) => {
      reader.onload = () => {
        setImageView(reader.result);
        resolve();
      };
    });
  }, []);

  const closeModal = useCallback(() => {
    setAddCropsModalOpen(false);
    setImage("");
  }, [addCropsModalOpen, image]);

  const handleColorClick = (color) => {
    setSelectedColor(color);
  };

  const handleButtonClick = () => {
    setIsOpen(!isOpen); // 버튼을 클릭할 때마다 열림/닫힘 상태 변경
  };

  const handleColorChange = useCallback(
    (newColor) => {
      setSelectedColor(newColor.hex);
      setIsOpen(false);
    },
    [isOpen, selectedColor],
  );

  // 선택한 색상이 기본색상인지 판단
  const isColorInArray = cropColorArray.includes(selectedColor);

  // 작물 등록 API
  const { mutate: createCropMutate } = useCreateCrop(
    () => {
      // 작물목록 정보 다시 불러오기 위해 쿼리키 삭제
      invalidateQueries([cropListKey]);
      setIsDefaultAlertShowState({
        isShow: true,
        type: "success",
        text: "정상적으로 추가되었습니다.",
        okClick: null,
      });
      closeModal();
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
            <p className="title">작물추가</p>
          </div>
          <div className="x-icon" onClick={closeModal}>
            <XIcon width={24} height={24} />
          </div>
        </S.TitleWrap>
        <S.InputWrap>
          <S.TextWrap>
            <p className="input-title">작물이미지</p>
          </S.TextWrap>
          <S.ImgWrap>
            {/* 이미지 미리보기 클릭 시 파일 선택 창 열기 */}
            <div onClick={handleImagePreviewClick} className="img-inner">
              {image ? (
                <img src={imageView} alt="Preview" className="yes-image" />
              ) : (
                <CropsNoIcon width={200} height={200} />
              )}
            </div>
          </S.ImgWrap>
          {/* 파일 업로드 입력 필드 */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              encodeFileToBase64(e.target.files[0]);
              setImage(e.target.files[0]);
            }}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <S.TextWrap>
            <p className="input-title">작물명</p>
          </S.TextWrap>
          <div className="input-wrap">
            <input placeholder="작물명을 입력하세요" value={cropsName} onChange={(e) => setCropsName(e.target.value)} />
          </div>
          <S.TextWrap>
            <p className="input-title">작물 표시 색상</p>
          </S.TextWrap>
          <S.Border />
          <S.ColorWrap>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-between",
              }}>
              {cropColorArray?.map((color, index) => (
                <div
                  key={`map${index}`}
                  onClick={() => handleColorClick(color)}
                  className="color-check-wrap"
                  style={{
                    backgroundColor: color,
                    width: "48px",
                    height: "48px",
                    margin: "5px",
                    cursor: "pointer",
                    position: "relative",
                    borderRadius: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}>
                  {selectedColor === color && (
                    <img
                      src="/images/setting/color-icon-check.svg" // 이미지 파일 경로를 지정합니다.
                      alt="Checkmark"
                      style={{
                        position: "absolute",
                        width: "24px",
                        height: "24px",
                      }}
                    />
                  )}
                </div>
              ))}
              <div className="color-check-wrap-rainbow" onClick={handleButtonClick}>
                {isColorInArray ? <RainbowIcon width={48} height={48} /> : <CheckRainbowIcon width={48} height={48} />}
              </div>
            </div>
            {isOpen && (
              <S.ColorPalette>
                <ChromePicker color={selectedColor} onChangeComplete={handleColorChange} />
              </S.ColorPalette>
            )}

            <S.Border />
          </S.ColorWrap>
        </S.InputWrap>

        {cropsName.length === 0 ? (
          <S.ButtonWrapOff>
            <p>저장</p>
          </S.ButtonWrapOff>
        ) : (
          <S.ButtonWrap
            onClick={() => {
              createCropMutate({
                data: {
                  name: cropsName,
                  color: selectedColor,
                  image: image,
                },
              });
            }}>
            <p>저장</p>
          </S.ButtonWrap>
        )}
      </S.WrapInner>
    </S.Wrap>
  );
}

export default AddCropsModal;
