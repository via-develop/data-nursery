from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from sqlalchemy.orm import Session, aliased
from sqlalchemy import func, case, extract, desc, asc, cast, String
from starlette.responses import JSONResponse
from datetime import datetime
from pytz import timezone

from utils.database import get_db
from utils.db_shortcuts import get_current_user, get_
from utils.file_upload import single_file_uploader, delete_file
from utils.singletone import ModelSingleTone

import src.crops.models as cropModels
import src.planter.models as planterModels


router = APIRouter()


@router.get("/search/crop_name", description="관리자용 작물명 검색 api", status_code=200)
def search_crop_name_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    crop_name_query = db.query(cropModels.Crop.name).filter(
        cropModels.Crop.is_del == False
    )

    if search:
        crop_name_query = crop_name_query.filter(
            cropModels.Crop.name.like(f"%{search}%")
        )

    crop_name_query = crop_name_query.order_by(cropModels.Crop.name.asc()).all()

    crop_name_response = [result[0] for result in crop_name_query]

    return crop_name_response


@router.patch(
    "/update/{crop_id}",
    description="관리자 작물 수정 api",
    status_code=200,
)
async def update_crop_info(
    request: Request,
    crop_id: int,
    name: str = Form(None),
    color: str = Form(None),
    image: UploadFile = File(None),
    image_del: bool = File(None),
    is_del: bool = Form(None),
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    crop = get_(db, cropModels.Crop, id=crop_id)

    if name:
        crop.name = name
    if color:
        crop.color = color
    if image:
        old_image = crop.image

        saved_file = await single_file_uploader(image)

        if not saved_file["is_success"]:
            return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_DATA"))
        crop.image = saved_file["url"]

    if image_del:
        if crop.image:
            await delete_file(crop.image)
            crop.image = None

    if is_del is not None:
        crop.is_del = is_del

    db.commit()
    db.refresh(crop)

    if image:
        await delete_file(old_image)

    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))


@router.patch(
    "/multiple/delete/{crop_ids}",
    description="작물 목록 다중 선택 후 삭제 api<br/> crop_ids = '1||2||3||4||5||6' 의 형태로 데이터 보내기",
    status_code=200,
)
def delete_multiple_crops(
    request: Request, crop_ids: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    target_ids = crop_ids.split("||")

    base_query = (
        db.query(cropModels.Crop).filter(cropModels.Crop.id.in_(target_ids)).all()
    )

    crop_updates = []

    for crop in base_query:
        crop_updates.append({"id": crop.id, "is_del": True})

    db.bulk_update_mappings(cropModels.Crop, crop_updates)
    db.commit()

    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))


@router.get(
    "/predict/output/{date_range}", description="기간 내 작물별 생산량 예측 값 조회", status_code=200
)
def get_crop_predct_output(
    request: Request, date_range: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    target_timezone = timezone("Asia/Seoul")
    start_date, end_date = date_range.split("||")
    start_year, start_month, start_day = start_date.split("-")
    end_year, end_month, end_day = end_date.split("-")

    target_start_date = datetime(
        int(start_year), int(start_month), int(start_day), tzinfo=target_timezone
    ).date()
    target_end_date = datetime(
        int(end_year), int(end_month), int(end_day), tzinfo=target_timezone
    ).date()

    pw = aliased(planterModels.PlanterWork)
    pws = aliased(planterModels.PlanterWorkStatus)

    last_pws_subq = db.query(
        pws.planter_work_id,
        func.max(pws.id).label("last_pws_id"),
    )

    if target_start_date == target_end_date:
        last_pws_subq = last_pws_subq.filter(
            pws.is_del == False,
            extract(
                "year",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_year,
            extract(
                "month",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_month,
            extract(
                "day",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_day,
        )
    else:
        last_pws_subq = last_pws_subq.filter(
            func.timezone("Asia/Seoul", pws.created_at) >= target_start_date,
            func.timezone("Asia/Seoul", pws.created_at) <= target_end_date,
        )

    last_pws_subq = last_pws_subq.group_by(pws.planter_work_id).subquery()

    crop_outputs = (
        db.query(
            # cropModels.Crop,
            cropModels.Crop.id,
            cropModels.Crop.name,
            cropModels.Crop.image,
            cropModels.Crop.color,
            func.sum(planterModels.PlanterOutput.output),
        )
        .join(pw, pw.crop_id == cropModels.Crop.id)
        .join(
            planterModels.PlanterOutput,
            planterModels.PlanterOutput.planter_work_id == pw.id,
        )
        .join(last_pws_subq, last_pws_subq.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == last_pws_subq.c.planter_work_id)
            & (pws.id == last_pws_subq.c.last_pws_id),
        )
        .filter(
            cropModels.Crop.is_del == False,
            pw.is_del == False,
            pws.status.in_(["DONE"]),
        )
        .group_by(
            cropModels.Crop.id,
            cropModels.Crop.name,
            cropModels.Crop.image,
            cropModels.Crop.color,
        )
        .order_by(cropModels.Crop.id.asc())
    )

    ai_predict_crop_names = [
        "고추",
        "토마토",
        "수박",
        "가지",
        "오이",
        "메론",
        "참외",
        "양파",
        "대파",
        "상추",
        "양배추",
        "배추",
        "파프리카",
        "호박",
    ]

    result = []

    for value in crop_outputs:
        # value 예시: (2, '고추', '/static/2023_08_30/792437_경로 설정 화면.jpeg', '#898989', Decimal('1000'))
        # 고추, 토마토, 수박, 가지, 오이, 메론, 참외, 양파, 대파, 상추, 양배추, 배추, 파프리카, 호박만 ai 예측정보 있음
        if not value[1] in ai_predict_crop_names:
            continue
        ai_predict = 0
        # INFO: 1ha = 3025평
        # 작물별 1평당 파종량 = sowing_rea
        if value[1] == "고추":
            sowing_area = 10
        elif value[1] == "토마토":
            sowing_area = 9
        elif value[1] == "수박":
            sowing_area = 2.5
        elif value[1] == "가지":
            sowing_area = 8
        elif value[1] == "메론":
            sowing_area = 6.5
        elif value[1] == "참외":
            sowing_area = 3
        elif value[1] == "양파":
            sowing_area = 110
        elif value[1] == "대파":
            sowing_area = 35
        elif value[1] == "상추":
            sowing_area = 120
        elif value[1] == "양배추":
            sowing_area = 11
        elif value[1] == "배추":
            sowing_area = 11
        elif value[1] == "파프리카":
            sowing_area = 8
        elif value[1] == "호박":
            sowing_area = 5

        # 파종량으로 파종면적(ha) 구하기
        area_ha = round(round(int(value[4]) / sowing_area, 4) / 3025, 4)
        if area_ha != 0:
            # ha로 수확량 예측
            ai_predict = ModelSingleTone.instance().get_crop_production(
                value[0], area_ha
            )

        result.append(
            {
                "crop_id": value[0],
                "crop_image": value[2],
                "crop_name": value[1],
                "crop_color": value[3],
                "ai_predict": ai_predict,
            }
        )
    return result


@router.get(
    "/predict/output/detail/{crop_id}/{date_range}",
    description="기간 내 선택 작물 날짜별 파종량 및 총 파종량",
    status_code=200,
)
def get_crop_predct_output(
    request: Request, crop_id: int, date_range: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    target_timezone = timezone("Asia/Seoul")
    start_date, end_date = date_range.split("||")
    start_year, start_month, start_day = start_date.split("-")
    end_year, end_month, end_day = end_date.split("-")

    target_start_date = datetime(
        int(start_year), int(start_month), int(start_day), tzinfo=target_timezone
    ).date()
    target_end_date = datetime(
        int(end_year), int(end_month), int(end_day), tzinfo=target_timezone
    ).date()

    pw = aliased(planterModels.PlanterWork)
    pws = aliased(planterModels.PlanterWorkStatus)

    last_pws_subq = db.query(
        pws.planter_work_id,
        func.max(pws.id).label("last_pws_id"),
    )

    if target_start_date == target_end_date:
        last_pws_subq = last_pws_subq.filter(
            pws.is_del == False,
            extract(
                "year",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_year,
            extract(
                "month",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_month,
            extract(
                "day",
                func.timezone("Asia/Seoul", pws.created_at),
            )
            == end_day,
        )
    else:
        last_pws_subq = last_pws_subq.filter(
            func.timezone("Asia/Seoul", pws.created_at) >= target_start_date,
            func.timezone("Asia/Seoul", pws.created_at) <= target_end_date,
        )

    last_pws_subq = last_pws_subq.group_by(pws.planter_work_id).subquery()

    crop_outputs = (
        db.query(
            func.timezone("Asia/Seoul", planterModels.PlanterOutput.updated_at),
            func.sum(planterModels.PlanterOutput.output),
        )
        .join(
            pw,
            pw.id == planterModels.PlanterOutput.planter_work_id,
        )
        .join(last_pws_subq, last_pws_subq.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == last_pws_subq.c.planter_work_id)
            & (pws.id == last_pws_subq.c.last_pws_id),
        )
        .filter(
            cropModels.Crop.is_del == False,
            cropModels.Crop.id == crop_id,
            pw.is_del == False,
            pws.status.in_(["DONE"]),
        )
        .group_by(planterModels.PlanterOutput.updated_at)
        .order_by(planterModels.PlanterOutput.updated_at.asc())
        .all()
    )

    crop_output_per_date = []
    total_output = 0

    result = dict()

    for value in crop_outputs:
        crop_output_per_date.append({"sowing_date": value[0], "output": value[1]})
        total_output += value[1]

    result["crop_output"] = crop_output_per_date
    result["total_output"] = total_output

    return result
