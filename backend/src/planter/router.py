from fastapi import APIRouter, Depends, Request
from sqlalchemy import func, extract, case, desc
from sqlalchemy.orm import Session, aliased
from starlette.responses import JSONResponse
from typing import Optional

from datetime import datetime
from pytz import timezone, utc


import src.planter.models as models
import src.planter.schemas as schemas
import src.crops.models as cropModels
from utils.database import get_db
from utils.db_shortcuts import get_, create_, get_current_user


router = APIRouter()


# @router.get(
#     "/{planter_sn}/latest-work",
#     status_code=200,
#     response_model=schemas.PlanterWorkResponse,
# )
# def get_lastest_work(planter_sn: str, db: Session = Depends(get_db)):
#     planter = (
#         db.query(models.Planter)
#         .filter(
#             models.Planter.is_del == False,
#             models.Planter.serial_number == planter_sn,
#         )
#         .first()
#     )

#     if not planter:
#         return JSONResponse(status_code=404, content=dict(msg="NO_MATCH_PLANTER"))

#     planter_works = (
#         db.query(models.PlanterWork)
#         .options(joinedload(models.PlanterWork.planter_work__planter_work_status))
#         .filter(models.PlanterWork.planter_id == planter.id)
#         .order_by(models.PlanterWork.created_at.desc())
#         .all()
#     )

#     if not planter_works:
#         return JSONResponse(
#             status_code=404, content=dict(msg="NO_WORK_FOUND_FOR_THIS_PLANTER")
#         )

#     latest_on_work = None

#     for work in planter_works:
#         latest_status = work.planter_work__planter_work_status[-1]
#         # latest_status = work.planter_work__planter_work_status[0]

#         if latest_status.status == "WORKING":
#             latest_on_work = work
#             break

#     if not latest_on_work:
#         return JSONResponse(status_code=404, content=dict(msg="NO_WORK_STATUS_ON"))

#     return {
#         "crop": latest_on_work.planter_work__crop,
#         "planter_work_status": latest_on_work.planter_work__planter_work_status[-1],
#         "planter_tray": latest_on_work.planter_work__planter_tray,
#         "planter_work": latest_on_work,
#     }


@router.post("/work/{serial_number}/output")
def create_planter_output(
    serial_number: str,
    planter_data: schemas.PlanterOperatingDataCreate,
    db: Session = Depends(get_db),
):
    planter = get_(db, models.Planter, serial_number=serial_number)
    planter_status, operating_count, operating_time = planter_data.data.split("||")

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(pws.planter_work_id, func.max(pws.id).label("last_pws_id"))
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_work_status_in_working = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(
            pw.is_del == False,
            pw.planter_id == planter.id,
            pws.status.in_(["WORKING", "PAUSE"]),
        )
        .first()
    )

    # 현재 파종기 동작 상태
    current_planter_status = (
        db.query(models.PlanterStatus)
        .filter(models.PlanterStatus.planter_id == planter.id)
        .order_by(models.PlanterStatus.created_at.desc())
        .first()
    )
    if not planter_work_status_in_working:
        # 파종기에 작업중인 작업이 없을 경우에 파종기 상태만 종료하기 위해 사용
        if planter_status == "0" and current_planter_status.status == "ON":
            new_planter_status = create_(
                db,
                models.PlanterStatus,
                status="OFF",
                operating_time=operating_time,
                planter_status__planter=planter,
            )
            db.add(new_planter_status)
            db.commit()
            db.refresh(new_planter_status)

            return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))
        elif planter_status == "1" and current_planter_status.status == "OFF":
            new_planter_status = create_(
                db,
                models.PlanterStatus,
                status="ON",
                operating_time=operating_time,
                planter_status__planter=planter,
            )
            db.add(new_planter_status)
            db.commit()
            db.refresh(new_planter_status)
            return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))
        else:
            return JSONResponse(status_code=404, content=dict(msg="NOT_WORKING_STATUS"))

    planter_output = planter_work_status_in_working.planter_works__planter_output



    new_planter_status = None

    # planter_status == 0 : 파종기 전원 상태가 OFF 상태
    if planter_status == "0":
        # 현재 파종기 동작 상태가 ON일 경우에는 OFF로 변경
        if current_planter_status.status == "ON":
            new_planter_status = create_(
                db,
                models.PlanterStatus,
                status="OFF",
                operating_time=operating_time,
                planter_status__planter=planter,
            )

        new_planter_work_status = create_(
            db,
            models.PlanterWorkStatus,
            status="DONE",
            planter_work_status__planter_work=planter_work_status_in_working,
        )

        # 파종기 종료시 혹시 PlanterOutput.start_count값이 None일 경우 0 저장
        if not planter_output.start_count:
            planter_output.start_count = 0
        # PlanterOutput.end_count에 파종기 동작 count값 저장
        planter_output.end_count = int(operating_count)

        # PlanterOutput.end_count - PlanterOutput.start_count 값이 0이하일 경우에는 PlanterOutput.output에 0 저장
        operating_count_in_planter_work_working = (
            planter_output.end_count - planter_output.start_count
        )
        if operating_count_in_planter_work_working < 0:
            planter_output.output = 0

        # 값이 0이상일 경우에
        else:
            planter_output.output = (
                planter_work_status_in_working.planter_work__planter_tray.width
                * operating_count_in_planter_work_working
            )

        if new_planter_status != None:
            db.add(new_planter_status)
        db.add(new_planter_work_status)
        db.add(planter_output)
        db.commit()
        if new_planter_status != None:
            db.refresh(new_planter_status)
        db.refresh(new_planter_work_status)
        db.refresh(planter_output)

    # planter_status == 1 : 파종기 전원 상태가 ON 상태
    else:
        # 현재 파종기 동작 상태가 OFF일 경우에는 ON으로 변경
        if current_planter_status.status == "OFF":
            new_planter_status = create_(
                db,
                models.PlanterStatus,
                status="ON",
                operating_time=operating_time,
                planter_status__planter=planter,
            )

        # PlanterOutput.start_count값이 None일 경우 operating_count 저장 -> 파종기 동작 중 작업상태를 WORKING(혹시나 WORKING 변경 후 바로 PAUSE)으로 변경했을 경우 파종량 계산 시작 값 저장
        if not planter_output.start_count:
            planter_output.start_count = int(operating_count)

        planter_output.end_count = int(operating_count)

        # PlanterOutput.end_count - PlanterOutput.start_count 값이 0미만일 경우에는 PlanterOutput.output에 0 저장
        operating_count_in_planter_work_working = (
            planter_output.end_count - planter_output.start_count
        )
        if operating_count_in_planter_work_working < 0:
            planter_output.output = 0
        # 값이 0이상일 경우에
        else:
            planter_output.output = (
                planter_work_status_in_working.planter_work__planter_tray.width
                * operating_count_in_planter_work_working
            )

        if new_planter_status != None:
            db.add(new_planter_status)
        db.add(planter_output)
        db.commit()
        if new_planter_status != None:
            db.refresh(new_planter_status)
        db.refresh(planter_output)

    # planter_work = get_(db, models.PlanterWork, id=planter_work_id)

    # if not planter_work:
    #     return JSONResponse(status_code=404, content=dict(msg="NO_MATCH_PLANTER_WORK"))

    # planter_work_output = get_(
    #     db,
    #     models.PlanterOutput,
    #     planter_work_id=planter_work_id,
    # )

    # if not planter_work_output:
    #     planter_work_output = create_(
    #         db,
    #         models.PlanterOutput,
    #         planter_work_id=planter_work_id,
    #     )

    # # 파종기 마지막 동작상태 가져오기 (PlanterStatus)
    # planter_status = (
    #     db.query(models.PlanterStatus)
    #     .join(models.PlanterStatus.planter_status__planter)
    #     .filter(models.Planter.id == planter_work.planter_id)
    #     .order_by(models.PlanterStatus.created_at.desc())
    #     .all()
    # )
    # status, output, operating_time = planter_data.data.split("||")
    # # status가 0일 경우 파종기 상태(PlanterStatus) 및 작업 상태(PlanterWorkStatus) 완료 저장
    # # status -> "1": 작업중("WORKING"), "0" : 작업완료("DONE")
    # save_planter_stauts = None
    # save_planter_work_status = None
    # if status == "0":
    #     if not planter_status or planter_status[0].status != "OFF":
    #         save_planter_stauts = create_(
    #             db,
    #             models.PlanterStatus,
    #             planter_id=planter_work.planter_id,
    #             status="OFF",
    #         )
    #         db.add(save_planter_stauts)

    #     if planter_work.planter_work__planter_work_status[-1].status != "DONE":
    #         save_planter_work_status = create_(
    #             db,
    #             models.PlanterWorkStatus,
    #             planter_work_id=planter_work_id,
    #             status="DONE",
    #         )

    #         if not save_planter_work_status:
    #             return JSONResponse(
    #                 status_code=400,
    #                 content=dict(msg="ERROR_CREATE_PLANTER_WORK_STATUS"),
    #             )

    #         db.add(save_planter_work_status)

    # elif status == "1":
    #     if not planter_status or planter_status[0].status != "ON":
    #         save_planter_stauts = create_(
    #             db,
    #             models.PlanterStatus,
    #             planter_id=planter_work.planter_id,
    #             status="ON",
    #         )
    #         db.add(save_planter_stauts)
    # else:
    #     return JSONResponse(status_code=422, content=dict(msg="INVALID_STATUS_VALUE"))
    # # output은 planter_work_output에 저장
    # planter_work_output.output = output

    # # operating_time 저장
    # planter_work.operating_time = operating_time

    # db.add(planter_work)
    # db.add(planter_work_output)
    # db.commit()
    # db.refresh(planter_work)
    # db.refresh(planter_work_output)
    # if save_planter_stauts != None:
    #     db.refresh(save_planter_stauts)
    # if save_planter_work_status != None:
    #     db.refresh(save_planter_work_status)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


# FIXME: 테스트 끝났을때 삭제하기
# @router.post(
#     "/test/planter/status/change",
#     status_code=200,
#     description="파종기 시리얼번호로 해당 api 요청 시 작업 상태가 WORKING으로 변경됩니다.\n테스트 종료 시 제거 예정",
# )
# def test_planter_status_change(serial_number: str, db: Session = Depends(get_db)):
#     planter_work_status = (
#         db.query(models.PlanterWorkStatus)
#         .join(models.PlanterWorkStatus.planter_work_status__planter_work)
#         .join(models.PlanterWork.planter_work__planter)
#         .filter(
#             models.Planter.is_del == False,
#             models.Planter.serial_number == serial_number,
#             models.PlanterWork.is_del == False,
#             models.PlanterWorkStatus.is_del == False,
#         )
#         .order_by(models.PlanterWorkStatus.created_at.desc())
#         .all()
#     )

#     if not planter_work_status:
#         return JSONResponse(status_code=404, content=dict(msg="NO_PLANTER_WORK_STATUS"))

#     if planter_work_status[0].status != "WORKING":
#         planter_work = (
#             db.query(models.PlanterWork)
#             .join(models.PlanterWork.planter_work__planter)
#             .filter(
#                 models.PlanterWork.is_del == False,
#                 models.Planter.serial_number == serial_number,
#             )
#             .order_by(models.PlanterWork.created_at.desc())
#             .all()
#         )
#         new_planter_work_status = models.PlanterWorkStatus(
#             planter_work_status__planter_work=planter_work[0], status="WORKING"
#         )
#         db.add(new_planter_work_status)
#         db.commit()
#         db.refresh(new_planter_work_status)

#     return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/farmhouse/register", status_code=200, description="농가에서 파종기 등록 시 사용")
def farm_house_register_planter(
    request: Request, serial_number: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)
    planter = get_(db, models.Planter, is_del=False, serial_number=serial_number)

    if not user.user_farm_house.farm_house_planter == planter:
        return JSONResponse(status_code=422, content=dict(msg="INVALID_PLANTER"))

    if planter.is_register:
        return JSONResponse(status_code=422, content=dict(msg="ALEADY_REGISTERED"))

    planter.is_register = True
    planter.register_date = datetime.utcnow()
    db.add(planter)
    db.commit()
    db.add(planter)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/tray/create")
def craete_planter_tray(
    request: Request, tray_data: schemas.PlanterTrayBase, db: Session = Depends(get_db)
):
    new_planter_tray = create_(
        db,
        models.PlanterTray,
        width=tray_data.width,
        height=tray_data.height,
        total=tray_data.total,
    )

    db.add(new_planter_tray)
    db.commit()
    db.refresh(new_planter_tray)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.get(
    "/tray/list", status_code=200, response_model=schemas.MultiplePlanterTrayResponse
)
def planter_tray_list(db: Session = Depends(get_db)):
    planter_trays = db.query(models.PlanterTray).filter_by(is_del=False).all()

    # planter_tray_list = [
    #     {"id": tray.id, "width": tray.width, "height": tray.height, "total": tray.total}
    #     for tray in planter_trays
    # ]

    return {"planter_trays": planter_trays}


@router.post("/work/create", status_code=201)
def create_planter_work(
    request: Request,
    work_data: schemas.PlanterWorkCreate,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)

    new_work = create_(
        db,
        models.PlanterWork,
        planter_id=user.user_farm_house.farm_house_planter.id,
        planter_tray_id=work_data.planter_tray_id,
        crop_id=work_data.crop_id,
        crop_kind=work_data.crop_kind,
        sowing_date=work_data.sowing_date,
        deadline=work_data.deadline,
        order_quantity=work_data.order_quantity,
        seed_quantity=work_data.seed_quantity,
    )

    new_work_status = create_(
        db,
        models.PlanterWorkStatus,
        planter_work_status__planter_work=new_work,
        status="WAIT",
    )

    new_planter_output = create_(
        db, models.PlanterOutput, planter_output__planter_works=new_work
    )

    db.add(new_work)
    db.add(new_work_status)
    db.add(new_planter_output)
    db.commit()
    db.refresh(new_work)
    db.refresh(new_work_status)
    db.refresh(new_planter_output)
    return JSONResponse(status_code=201, content=dict(msg="CREATED_WORK"))


@router.get(
    "/work/working/list/{serial_number}",
    status_code=200,
    description="파종기 작업 중 작업중인 목록(WORKING, PAUSE 상태)을 불러올때 사용",
)
def planter_work_working_pause_list(
    request: Request, serial_number: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)

    planter = user.user_farm_house.farm_house_planter
    # 유저에 등록된 시리얼번호와 일치하는지 확인
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(
            pws.planter_work_id,
            func.max(pws.id).label("last_pws_id"),
        )
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_working_or_pause_status = (
        db.query(pw, pws.status.label("last_status"))
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(
            pw.is_del == False,
            pw.planter_id == planter.id,
            pws.status.in_(["WORKING", "PAUSE"]),
        )
        .order_by(pws.created_at.desc())
    ).first()

    if not planter_works_with_recent_working_or_pause_status:
        return None

    planter_work_output = planter_works_with_recent_working_or_pause_status[
        0
    ].planter_works__planter_output

    return {
        "id": planter_works_with_recent_working_or_pause_status[0].id,
        "crop_img": planter_works_with_recent_working_or_pause_status[
            0
        ].planter_work__crop.image,
        "crop_kind": planter_works_with_recent_working_or_pause_status[0].crop_kind,
        "planter_work_output": planter_work_output.output
        if planter_work_output is not None
        else 0,
        "planter_status": planter_works_with_recent_working_or_pause_status[1],
        "tray_total": planter_works_with_recent_working_or_pause_status[
            0
        ].planter_work__planter_tray.total,
    }


@router.get(
    "/work/wait/list/{serial_number}",
    status_code=200,
    description="파종기 작업 중 대기중인 목록(WAIT 상태)을 불러올때 사용",
)
def planter_work_wait_list(
    request: Request,
    serial_number: str,
    page: int = 1,
    size: int = 8,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    planter = user.user_farm_house.farm_house_planter
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(pws.planter_work_id, func.max(pws.id).label("last_pws_id"))
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_wait_status = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(pw.is_del == False, pw.planter_id == planter.id, pws.status == "WAIT")
        .order_by(pw.created_at.desc())
    )

    total = planter_works_with_recent_wait_status.count()

    result_data = []
    for planter_work in (
        planter_works_with_recent_wait_status.offset(page * size).limit(size).all()
    ):
        result_data.append(
            {
                "id": planter_work.id,
                "crop_name": planter_work.planter_work__crop.name,
                "crop_kine": planter_work.crop_kind,
                "seed_quantity": planter_work.seed_quantity,
                "tray_total": planter_work.planter_work__planter_tray.total,
            }
        )

    return {"total": total, "planter_works": result_data}


@router.get(
    "/work/done/list/{serial_number}/{year}/{month}/{date}",
    status_code=200,
    description="파종기 작업 중 특정 날짜의 완료된 목록(DONE 상태)을 불러올때 사용<br/>year: 2023, month: 8, date: 31",
)
def planter_work_done_datetime_list(
    request: Request,
    serial_number: str,
    year: int,
    month: int,
    date: int,
    page: int = 1,
    size: int = 8,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    planter = user.user_farm_house.farm_house_planter
    if planter.serial_number != serial_number:
        return JSONResponse(status_code=400, content=dict(msg="NOT_MATCHED_PLANTER"))

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    target_timezone = timezone("Asia/Seoul")
    target_date = datetime(year, month, date, tzinfo=target_timezone).date()

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    recent_status_subquery = (
        db.query(
            pws.planter_work_id,
            func.max(pws.id).label("last_pws_id"),
        )
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    planter_works_with_recent_done_status = (
        db.query(pw)
        .join(recent_status_subquery, recent_status_subquery.c.planter_work_id == pw.id)
        .join(
            pws,
            (pws.planter_work_id == recent_status_subquery.c.planter_work_id)
            & (pws.id == recent_status_subquery.c.last_pws_id),
        )
        .filter(
            pw.is_del == False,
            pw.planter_id == planter.id,
            pws.status == "DONE",
            # cast(func.timezone("Asia/Seoul", pw.created_at), Date) == target_date,
            func.Date(func.timezone("Asia/Seoul", pw.created_at)) == target_date,
        )
        .order_by(pw.created_at.desc())
    )

    total = planter_works_with_recent_done_status.count()
    total_seed_quantity = 0
    for planter_work in planter_works_with_recent_done_status.all():
        total_seed_quantity += planter_work.seed_quantity

    result_data = []
    for planter_work in (
        planter_works_with_recent_done_status.offset(page * size).limit(size).all()
    ):
        result_data.append(
            {
                "id": planter_work.id,
                "crop_name": planter_work.planter_work__crop.name,
                "crop_image": planter_work.planter_work__crop.image,
                "crop_kind": planter_work.crop_kind,
                "sowing_date": planter_work.sowing_date,
                "deadline": planter_work.deadline,
                "seed_quantity": planter_work.seed_quantity,
                "tray_total": planter_work.planter_work__planter_tray.total,
            }
        )

    return {
        "total": total,
        "total_seed_quantity": total_seed_quantity,
        "planter_works": result_data,
    }


@router.patch(
    "/work/status/update/{planter_work_id}",
    status_code=200,
    description="파종기 작업 상태 변경 시 사용<br/>WAIT: 대기중, WORKING: 작업중, DONE: 완료, PAUSE: 일시정지",
)
def update_planter_work_status(
    request: Request, planter_work_id: int, status: str, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)
    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    request_planter_work = get_(db, pw, id=planter_work_id)
    if not request_planter_work:
        return JSONResponse(
            status_code=404,
            content=dict(msg="NOT_FOUND_PLANT_WORK"),
        )
    request_planter = request_planter_work.planter_work__planter

    # 유저에 등록된 파종기 시리얼넘버와 요청한 Planter_work_id의 파종기 시리얼넘버 비교
    if (
        user.user_farm_house.farm_house_planter.serial_number
        != request_planter.serial_number
    ):
        return JSONResponse(
            status_code=404,
            content=dict(msg="NO_MATCH_PLANTER_WORK_WITH_ENROLLED_PLANTER"),
        )

    last_planter_work_status = (
        db.query(pws)
        .filter(
            pws.is_del == False,
            pws.planter_work_id == planter_work_id,
        )
        .order_by(pws.created_at.desc())
        .first()
    )

    # 작업상태를 WORKING으로 변경
    if status == "WORKING":
        # 현재 상태가 WAIT일 경우
        if last_planter_work_status.status == "WAIT":
            last_planter_work_status_subquery = (
                db.query(pws.planter_work_id, func.max(pws.id).label("last_pwd_id"))
                .filter(pws.is_del == False)
                .group_by(pws.planter_work_id)
                .subquery()
            )

            check_working_puase_planter_work = (
                db.query(pw)
                .join(
                    last_planter_work_status_subquery,
                    last_planter_work_status_subquery.c.planter_work_id == pw.id,
                )
                .join(
                    pws,
                    (
                        pws.planter_work_id
                        == last_planter_work_status_subquery.c.planter_work_id
                    )
                    & (pws.id == last_planter_work_status_subquery.c.last_pwd_id),
                )
                .filter(
                    pw.is_del == False,
                    pw.planter_id == request_planter.id,
                    pws.status.in_(["WORKING", "PAUSE"]),
                )
                .order_by(pw.created_at.desc())
                .all()
            )

            # 현재 Planter의 PlanterWork 중 PlanterWorkStatus가 WORKING, PAUSE상태가 아니라면 WORKING으로 변경
            if not check_working_puase_planter_work:
                new_planter_work_status = create_(
                    db,
                    models.PlanterWorkStatus,
                    planter_work_id=planter_work_id,
                    status="WORKING",
                )
                db.add(new_planter_work_status)
                db.commit()
                db.refresh(new_planter_work_status)
                return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
            # 이미 Planter에 등록된 PlanterWork 중 WORKING 또는 PAUSE 상태인 작업이 있어 오류 리턴
            else:
                return JSONResponse(
                    status_code=400, content=dict(msg="ALEADY_WORKING_PLANTER")
                )

        # 현재 상태가 PAUSE일 경우 : WORKING으로 변경
        elif last_planter_work_status.status == "PAUSE":
            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="WORKING",
            )
            db.add(new_planter_work_status)
            db.commit()
            db.refresh(new_planter_work_status)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        # 현재 상태가 DONE, WOKRING일 경우 : 오류 리턴
        else:
            return JSONResponse(
                status_code=400, content=dict(msg="ALEADY_DONE_OR_WOKRING")
            )
    # 현재 PlanterWorkStatus의 상태가 WORKING일 경우에만 동작
    elif status == "PAUSE":
        if last_planter_work_status.status == "WORKING":
            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="PAUSE",
            )
            db.add(new_planter_work_status)
            db.commit()
            db.refresh(new_planter_work_status)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        else:
            return JSONResponse(
                status_code=400, content=dict(msg="NOT_CHANGE_TO_PAUSE")
            )
    # 현재 상태가 WORKING, PAUSE 일 경우에만 동작
    elif status == "DONE":
        if (
            last_planter_work_status.status == "WORKING"
            or last_planter_work_status.status == "PAUSE"
        ):
            planter_output = (
                last_planter_work_status.planter_work_status__planter_work.planter_works__planter_output
            )
            # PlanterOutput.start_count값이 None일 경우 start_count = 0 저장
            if not planter_output.start_count:
                planter_output.start_count = 0

            # PlanterOutput.end_count - PlanterOutput.start_count 값이 0미만일 경우에는 PlanterOutput.output에 0 저장
            operating_count_in_planter_work_working = (
                planter_output.end_count - planter_output.start_count
            )
            if operating_count_in_planter_work_working < 0:
                planter_output.output = 0
            # 값이 0이상일 경우에
            else:
                planter_output.output = (
                    last_planter_work_status.planter_work_status__planter_work.planter_work__planter_tray.width
                    * operating_count_in_planter_work_working
                )

            new_planter_work_status = create_(
                db,
                models.PlanterWorkStatus,
                planter_work_id=planter_work_id,
                status="DONE",
            )
            db.add(new_planter_work_status)
            db.add(planter_output)
            db.commit()
            db.refresh(new_planter_work_status)
            db.refresh(planter_output)
            return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
        else:
            return JSONResponse(status_code=422, content=dict(msg="NOT_CHANGE_TO_DONE"))
    else:
        return JSONResponse(status_code=422, content=dict(msg="INVALID_REQUEST_VALUE"))


@router.get(
    "/work/info/{planter_work_id}",
    status_code=200,
    response_model=schemas.PlanterWorkResponse,
)
def get_planter_work_info(
    request: Request, planter_work_id: int, db: Session = Depends(get_db)
):
    user = get_current_user("01", request.cookies, db)
    user_planter = user.user_farm_house.farm_house_planter
    request_planter_work = get_(db, models.PlanterWork, id=planter_work_id)
    if not request_planter_work:
        return JSONResponse(
            status_code=404,
            content=dict(msg="NOT_FOUND_PLANT_WORK"),
        )
    request_planter = request_planter_work.planter_work__planter

    if user_planter.serial_number != request_planter.serial_number:
        return JSONResponse(
            status_code=404,
            content=dict(msg="NO_MATCH_PLANTER_WORK_WITH_ENROLLED_PLANTER"),
        )

    last_planter_work_status = (
        db.query(models.PlanterWorkStatus)
        .filter(
            models.PlanterWorkStatus.is_del == False,
            models.PlanterWorkStatus.planter_work_id == planter_work_id,
        )
        .order_by(models.PlanterWorkStatus.created_at.desc())
        .first()
    )

    return {
        "crop": request_planter_work.planter_work__crop,
        "planter_work_status": last_planter_work_status,
        "planter_tray": request_planter_work.planter_work__planter_tray,
        "planter_work": request_planter_work,
    }


@router.patch(
    "/work/info/update/{planter_work_id}",
    status_code=200,
)
def update_planter_work_info(
    request: Request,
    planter_work_id: int,
    planter_work_data: schemas.PlanterWorkUpdate,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    user_planter = user.user_farm_house.farm_house_planter
    request_planter_work = get_(db, models.PlanterWork, id=planter_work_id)
    if not request_planter_work:
        return JSONResponse(
            status_code=404,
            content=dict(msg="NOT_FOUND_PLANT_WORK"),
        )
    request_planter = request_planter_work.planter_work__planter

    if user_planter.serial_number != request_planter.serial_number:
        return JSONResponse(
            status_code=404,
            content=dict(msg="NO_MATCH_PLANTER_WORK_WITH_ENROLLED_PLANTER"),
        )

    for field in planter_work_data.__dict__:
        if getattr(planter_work_data, field) is not None:
            setattr(request_planter_work, field, getattr(planter_work_data, field))

    if request_planter_work.is_del:
        db.query(models.PlanterWorkStatus).filter(
            models.PlanterWorkStatus.planter_work_id == request_planter_work.id,
            models.PlanterWorkStatus.is_del == False,
        ).update({"is_del": True})
        db.query(models.PlanterOutput).filter(
            models.PlanterOutput.planter_work_id == request_planter_work.id,
            models.PlanterOutput.is_del == False,
        ).update({"is_del": True})

    db.commit()
    db.refresh(request_planter_work)

    return JSONResponse(status_code=200, content=dict(msg="UPDATE_SUCCESS"))


@router.get("/today/dashboard", status_code=200)
def get_farmhouse_today_dashboard(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("01", request.cookies, db)
    user_planter = user.user_farm_house.farm_house_planter

    pw = aliased(models.PlanterWork)
    pws = aliased(models.PlanterWorkStatus)

    last_plant_work_status_done_subquery = (
        db.query(
            pws.planter_work_id,
            func.max(pws.id).label("last_pws_id"),
        )
        .filter(pws.is_del == False)
        .group_by(pws.planter_work_id)
        .subquery()
    )

    base_query = (
        db.query(pw)
        .join(
            last_plant_work_status_done_subquery,
            last_plant_work_status_done_subquery.c.planter_work_id == pw.id,
        )
        .join(
            pws,
            (
                pws.planter_work_id
                == last_plant_work_status_done_subquery.c.planter_work_id
            )
            & (pws.id == last_plant_work_status_done_subquery.c.last_pws_id),
        )
        .join(
            models.PlanterStatus,
            (models.PlanterStatus.planter_id == user_planter.id)
            & (pw.planter_id == user_planter.id),
        )
        .filter(
            pw.is_del == False,
            pws.status == "DONE",
            # func.Date(pws.created_at) == datetime.now(tz=utc).date(),
            func.Date(pws.updated_at) == datetime.utcnow().date(),
        )
    )

    # today_total_seed_quantity = base_query.with_entities(
    #     func.sum(pw.seed_quantity)
    # ).scalar()
    today_total_seed_quantity_query = base_query.with_entities(
        pw.id,
        pw.seed_quantity
    ).group_by(pw.id, pw.seed_quantity).all()
    today_total_seed_quantity = 0
    for _, pw_seed_quantity in today_total_seed_quantity_query:
        today_total_seed_quantity += pw_seed_quantity

    

    today_best_crop_kind = (
        # base_query.with_entities(pw.crop_kind, func.sum(pw.seed_quantity))
        # .group_by(pw.crop_kind)
        # .order_by(func.sum(pw.seed_quantity).desc())
        # .first()
        base_query.with_entities(pw.crop_kind, pw.seed_quantity)
        .group_by(pw.crop_kind, pw.seed_quantity)
        .order_by(pw.seed_quantity.desc())
        .first()
    )

    today_best_crop_kind_result = None

    if today_best_crop_kind is not None:
        today_best_crop_kind_result = {
            "crop_kind": today_best_crop_kind[0],
            "total_seed_quantity": today_best_crop_kind[1],
        }

    today_planter_usage = base_query.with_entities(pw.id).group_by(pw.id).count()


    planter_status_operating_time = (
        db.query(func.sum(models.PlanterStatus.operating_time))
        .filter(
            models.PlanterStatus.is_del == False,
            models.PlanterStatus.planter_id == user_planter.id,
            models.PlanterStatus.status == "OFF",
            func.Date(models.PlanterStatus.updated_at) == datetime.now(tz=utc).date(),
        )
        .scalar()
    )

    return {
        "today_total_seed_quantity": today_total_seed_quantity,
        "today_best_crop_kind": today_best_crop_kind_result,
        "today_planter_usage": {
            "working_times": today_planter_usage,
            "time": planter_status_operating_time,
        },
    }


@router.get(
    "/month/statics/{year}/{month}", description="월별 농가 통계현황 api", status_code=200
)
def get_farmhouse_month_statics(
    request: Request,
    year: int,
    month: int,
    db: Session = Depends(get_db),
):
    user = get_current_user("01", request.cookies, db)
    planter = user.user_farm_house.farm_house_planter

    # total_output = (
    #     db.query(func.sum(models.PlanterOutput.output))
    #     .join(
    #         models.PlanterWork,
    #         (models.PlanterWork.planter_id == planter.id)
    #         & (models.PlanterOutput.planter_work_id == models.PlanterWork.id),
    #     )
    #     .filter(
    #         extract(
    #             "year", func.timezone("Asia/Seoul", models.PlanterOutput.updated_at)
    #         )
    #         == year,
    #     )
    # )
    total_output = (
        db.query(func.sum(models.PlanterWork.seed_quantity))
        .join(
            models.PlanterWorkStatus,
            (models.PlanterWork.planter_id == planter.id)
            & (models.PlanterWorkStatus.planter_work_id == models.PlanterWork.id),
        )
        .filter(
            models.PlanterWork.is_del == False,
            extract(
                "year", func.timezone("Asia/Seoul", models.PlanterWork.updated_at)
            )
            == year,
            models.PlanterWorkStatus.status == "DONE"
        )
    )


    done_count = (
        db.query(
            func.sum(case((models.PlanterWorkStatus.status == "DONE", 1), else_=0))
        )
        .join(
            models.PlanterWork,
            (models.PlanterWork.planter_id == planter.id)
            & (models.PlanterWorkStatus.planter_work_id == models.PlanterWork.id),
        )
        .filter(
            models.PlanterWork.is_del == False,
            extract(
                "year", func.timezone("Asia/Seoul", models.PlanterWorkStatus.updated_at)
            )
            == year,
        )
    )

    # popular_crop = (
    #     db.query(
    #         cropModels.Crop.name,
    #         cropModels.Crop.image,
    #         func.sum(models.PlanterOutput.output).label("total_output"),
    #     )
    #     .join(
    #         models.PlanterWork,
    #         (cropModels.Crop.id == models.PlanterWork.crop_id)
    #         & (planter.id == models.PlanterWork.planter_id),
    #     )
    #     .join(
    #         models.PlanterOutput,
    #         models.PlanterWork.id == models.PlanterOutput.planter_work_id,
    #     )
    #     .filter(
    #         extract(
    #             "year", func.timezone("Asia/Seoul", models.PlanterOutput.updated_at)
    #         )
    #         == year,
    #     )
    # )
    popular_crop = (
        db.query(
            cropModels.Crop.name,
            cropModels.Crop.image,
            func.sum(models.PlanterWork.seed_quantity).label("total_output"),
        )
        .join(
            models.PlanterWork,
            (cropModels.Crop.id == models.PlanterWork.crop_id)
            & (planter.id == models.PlanterWork.planter_id),
        )
        .filter(
            models.PlanterWork.is_del == False,
            extract(
                "year", func.timezone("Asia/Seoul", models.PlanterWork.updated_at)
            )
            == year,
        )
    )

    if month == 0:
        total_output = total_output.scalar() or 0
        done_count = done_count.scalar() or 0
        # daily_output = (
        #     db.query(
        #         extract("month", models.PlanterOutput.updated_at).label("month"),
        #         func.sum(models.PlanterOutput.output).label("total_output"),
        #     )
        #     .join(
        #         models.PlanterWork,
        #         (models.PlanterWork.planter_id == planter.id)
        #         & (models.PlanterWork.id == models.PlanterOutput.planter_work_id),
        #     )
        #     .filter(
        #         extract(
        #             "year", func.timezone("Asia/Seoul", models.PlanterOutput.updated_at)
        #         )
        #         == year,
        #     )
        #     .group_by("month")
        #     .all()
        # )
        daily_output = (
            db.query(
                extract("month", models.PlanterWork.updated_at).label("month"),
                func.sum(models.PlanterWork.seed_quantity).label("total_output"),
            )
            .filter(
                models.PlanterWork.planter_id == planter.id,
                models.PlanterWork.is_del == False,
                extract(
                    "year", func.timezone("Asia/Seoul", models.PlanterWork.updated_at)
                )
                == year,
            )
            .group_by("month")
            .all()
        )

        popular_crop = (
            popular_crop.group_by(cropModels.Crop.name, cropModels.Crop.image)
            .order_by(desc("total_output"))
            .all()
        )

        daily_output_result = [
            {"month": month, "output": output} for month, output in daily_output
        ]
    else:
        total_output = (
            total_output.filter(
                extract(
                    "month",
                    # func.timezone("Asia/Seoul", models.PlanterOutput.updated_at),
                    func.timezone("Asia/Seoul", models.PlanterWork.updated_at),
                )
                == month,
            ).scalar()
            or 0
        )
        done_count = (
            done_count.filter(
                extract(
                    "month",
                    func.timezone("Asia/Seoul", models.PlanterWorkStatus.updated_at),
                )
                == month,
            ).scalar()
            or 0
        )
        # daily_output = (
        #     db.query(
        #         extract("day", models.PlanterOutput.updated_at).label("day"),
        #         func.sum(models.PlanterOutput.output).label("total_output"),
        #     )
        #     .join(
        #         models.PlanterWork,
        #         (models.PlanterWork.planter_id == planter.id)
        #         & (models.PlanterWork.id == models.PlanterOutput.planter_work_id),
        #     )
        #     .filter(
        #         extract(
        #             "year", func.timezone("Asia/Seoul", models.PlanterOutput.updated_at)
        #         )
        #         == year,
        #         extract(
        #             "month",
        #             func.timezone("Asia/Seoul", models.PlanterOutput.updated_at),
        #         )
        #         == month,
        #     )
        #     .group_by("day")
        #     .all()
        # )
        daily_output = (
            db.query(
                extract("day", models.PlanterWork.updated_at).label("day"),
                func.sum(models.PlanterWork.seed_quantity).label("total_output"),
            )
            .filter(
                models.PlanterWork.planter_id == planter.id,
                models.PlanterWork.is_del == False,
                extract(
                    "year", func.timezone("Asia/Seoul", models.PlanterWork.updated_at)
                )
                == year,
                extract(
                    "month",
                    func.timezone("Asia/Seoul", models.PlanterWork.updated_at),
                )
                == month,
            )
            .group_by("day")
            .all()
        )

        popular_crop = (
            popular_crop.filter(
                extract(
                    "month",
                    func.timezone("Asia/Seoul", models.PlanterWork.updated_at),
                )
                == month,
            )
            .group_by(cropModels.Crop.name, cropModels.Crop.image)
            .order_by(desc("total_output"))
            .all()
        )

        daily_output_result = [
            {"day": day, "output": output} for day, output in daily_output
        ]

    popular_crop_result = [
        {"name": name, "image": image, "output": output}
        for name, image, output in popular_crop
    ]

    return {
        "total_output": total_output,
        "working_times": done_count,
        "daily_output": daily_output_result,
        "popular_crop": popular_crop_result,
    }
