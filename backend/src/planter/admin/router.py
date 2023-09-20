from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import func, case, extract, desc, asc, cast, String
from starlette.responses import JSONResponse
from datetime import date, datetime, timedelta
from pytz import timezone, utc
from collections import defaultdict


import src.auth.models as authModels
import src.planter.models as planterModels
import src.planter.admin.schemas as planterAdminSchemas
import src.crops.models as cropModels
from utils.database import get_db
from utils.db_shortcuts import get_current_user, get_


router = APIRouter()


@router.get(
    "/dashboard/status",
    description="관리자 개요페이지 내 농가수, 작물수, 파종기, 누적파종량 가져오는 api 입니다.",
    status_code=200,
    response_model=planterAdminSchemas.DashboardResponse,
)
def get_admin_dashboard_data(request: Request, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    # 농가 수
    farmhouse_count = (
        db.query(authModels.FarmHouse)
        .filter(authModels.FarmHouse.is_del == False)
        .count()
    )
    # 작물 수
    crop_count = (
        db.query(cropModels.Crop).filter(cropModels.Crop.is_del == False).count()
    )
    # 파종기 수
    planter_count = (
        db.query(planterModels.Planter)
        .filter(planterModels.Planter.is_del == False)
        .count()
    )
    # 누적 파종량
    total_output = (
        db.query(func.sum(planterModels.PlanterOutput.output))
        # .filter(planterModels.PlanterOutput.is_del == False)
        .scalar()
    )

    return {
        "farmhouse_count": farmhouse_count,
        "crop_count": crop_count,
        "planter_count": planter_count,
        "total_output": total_output,
    }


@router.get(
    "/dashboard/real-time",
    description="관리자 개요페이지 내 실시간 가동현황 불러오기",
)
def get_admin_dashboard_realtime_planter(
    request: Request, page: int = 1, size: int = 8, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    last_planter_status_subquery = (
        db.query(
            planterModels.PlanterStatus.planter_id,
            func.max(planterModels.PlanterStatus.id).label("last_status_id"),
        )
        .filter(planterModels.PlanterStatus.is_del == False)
        .group_by(planterModels.PlanterStatus.planter_id)
        .subquery()
    )

    target_timezone = timezone("Asia/Seoul")
    target_date = datetime.now(tz=target_timezone).date()

    planters_data = (
        db.query(
            planterModels.Planter.id,
            authModels.FarmHouse.name.label("farm_house_name"),
            planterModels.PlanterStatus.status.label("planter_status"),
            func.sum(planterModels.PlanterOutput.output).label("planter_output"),
        )
        .join(
            authModels.FarmHouse,
            authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
        )
        .join(
            last_planter_status_subquery,
            last_planter_status_subquery.c.planter_id == planterModels.Planter.id,
        )
        .join(
            planterModels.PlanterStatus,
            planterModels.PlanterStatus.id
            == last_planter_status_subquery.c.last_status_id,
        )
        .outerjoin(
            planterModels.PlanterWork,
            planterModels.PlanterWork.planter_id == planterModels.Planter.id,
        )
        .outerjoin(
            planterModels.PlanterOutput,
            (
                planterModels.PlanterOutput.planter_work_id
                == planterModels.PlanterWork.id
            )
            & (
                func.Date(
                    func.timezone("Asia/Seoul", planterModels.PlanterOutput.updated_at)
                )
                >= target_date
            ),
        )
        .filter(
            planterModels.Planter.is_del == False,
            authModels.FarmHouse.is_del == False,
            # planterModels.PlanterOutput.created_at >= date.today(),
            # planterModels.PlanterStatus.status.in_(["ON", "PAUSE", "OFF"]),
        )
        .group_by(
            planterModels.Planter.id,
            authModels.FarmHouse.name,
            planterModels.PlanterStatus.id,
            planterModels.PlanterStatus.status,
        )
        .order_by(
            case(
                (planterModels.PlanterStatus.status == "ON", 1),
                (planterModels.PlanterStatus.status == "PAUSE", 2),
                (planterModels.PlanterStatus.status == "OFF", 3),
                else_=4,
            ),
            planterModels.PlanterStatus.id.desc(),
        )
    )

    total = planters_data.count()

    planter_responses = []

    for planter_id, farm_house_name, planter_status, planter_output in (
        planters_data.offset(page * size).limit(size).all()
    ):
        planter_responses.append(
            {
                "planter": planter_id,
                "farm_house_name": farm_house_name,
                "planter_status": planter_status,
                "planter_output": planter_output,
            }
        )

    return {"total": total, "planter": planter_responses}


@router.get(
    "/total-output",
    status_code=200,
    description="관리자 개요페이지 총 생산량 조회 api<br/>query_type = 'day' : 일별 조회<br/>query_type = 'month' : 월별 조회",
)
def get_total_output(request: Request, query_type: str, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    if query_type == "day":
        daily_sum = (
            db.query(
                extract("day", planterModels.PlanterOutput.updated_at).label("day"),
                func.sum(planterModels.PlanterOutput.output).label("output_sum"),
            )
            .filter(
                extract("month", planterModels.PlanterOutput.updated_at).label("month")
                == datetime.utcnow().month
            )
            .group_by("day")
            .all()
        )

        return [{"day": item[0], "output": item[1]} for item in daily_sum]
    elif query_type == "month":
        monthly_sum = (
            db.query(
                extract("month", planterModels.PlanterOutput.updated_at).label("month"),
                func.sum(planterModels.PlanterOutput.output).label("output_sum"),
            )
            .filter(
                extract("year", planterModels.PlanterOutput.updated_at).label("hour")
                == datetime.utcnow().year
            )
            .group_by("month")
            .all()
        )

        return [{"month": item[0], "output": item[1]} for item in monthly_sum]

    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))


@router.get(
    "/crop/total-output",
    status_code=200,
    description="관리자 개요페이지 작물별 생산량 조회 api <br/>query_type = 'day' : 일별 조회<br/>query_type = 'month' : 월별 조회",
)
def get_crop_total_output(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    grouped_data = defaultdict(list)

    if query_type == "day":
        houly_crop_sums = (
            db.query(
                cropModels.Crop.name,
                cropModels.Crop.color,
                extract("day", planterModels.PlanterOutput.updated_at).label("day"),
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.PlanterWork,
                cropModels.Crop.id == planterModels.PlanterWork.crop_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                extract("month", planterModels.PlanterOutput.updated_at).label("month")
                == datetime.utcnow().month
            )
            .group_by(cropModels.Crop.name, cropModels.Crop.color, "day")
            .all()
        )

        for crop_name, color, day, total_output in houly_crop_sums:
            crop_name = crop_name.lower()
            grouped_data[crop_name].append(
                {"day": int(day), "color": color, "output": int(total_output)}
            )
    elif query_type == "month":
        monthly_crop_sums = (
            db.query(
                cropModels.Crop.name,
                cropModels.Crop.color,
                extract("month", planterModels.PlanterOutput.updated_at).label("month"),
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.PlanterWork,
                cropModels.Crop.id == planterModels.PlanterWork.crop_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                extract("year", planterModels.PlanterOutput.updated_at).label("year")
                == datetime.utcnow().year
            )
            .group_by(cropModels.Crop.name, cropModels.Crop.color, "month")
            .all()
        )

        for crop_name, color, month, total_output in monthly_crop_sums:
            crop_name = crop_name.lower()
            grouped_data[crop_name].append(
                {"month": int(month), "color": color, "output": int(total_output)}
            )
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))
    return grouped_data


@router.get(
    "/farmhouse/output",
    description="농가별 생산량을 당일, 당월 기준으로 조회하는 api<br/>query_type='day': 당일 조회<br/>query_type='month': 당월 조회",
    status_code=200,
)
def get_farmhouse_output(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    utc_now = datetime.utcnow()
    if query_type == "day":
        farmhouse_output = (
            db.query(
                authModels.FarmHouse.id,
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterWork,
                planterModels.Planter.id == planterModels.PlanterWork.planter_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(func.Date(planterModels.PlanterOutput.updated_at) == utc_now.date())
            .group_by(authModels.FarmHouse.id, authModels.FarmHouse.name)
            .order_by(authModels.FarmHouse.name.asc())
            .all()
        )

        farmhouse_output_response = [
            {
                "farmhouse_id": result.id,
                "farmhouse_name": result.name,
                "total_output": int(result.total_output),
            }
            for result in farmhouse_output
        ]

    elif query_type == "month":
        farmhouse_output = (
            db.query(
                authModels.FarmHouse.id,
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterOutput.output).label("total_output"),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterWork,
                planterModels.Planter.id == planterModels.PlanterWork.planter_id,
            )
            .join(
                planterModels.PlanterOutput,
                planterModels.PlanterWork.id
                == planterModels.PlanterOutput.planter_work_id,
            )
            .filter(
                extract("year", planterModels.PlanterOutput.updated_at) == utc_now.year,
                extract("month", planterModels.PlanterOutput.updated_at)
                == utc_now.month,
            )
            .group_by(authModels.FarmHouse.id, authModels.FarmHouse.name)
            .order_by(desc("total_output"))
            .all()
        )

        farmhouse_output_response = [
            {
                "farmhouse_id": result.id,
                "farmhouse_name": result.name,
                "total_output": int(result.total_output),
            }
            for result in farmhouse_output
        ]
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))
    return farmhouse_output_response


@router.get(
    "/planter/total-operating-time",
    description="파종기 가동시간을 전일, 전원을 기준으로 조회하는 api<br/>query_type='day': 전일 조회<br/>query_type='month': 전월 조회",
    status_code=200,
)
def get_planter_total_operating_time(
    request: Request, query_type: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    utc_now = datetime.utcnow()

    if query_type == "day":
        yesterday = utc_now.date() - timedelta(days=1)
        total_planter_status_operating_time = (
            db.query(
                func.avg(planterModels.PlanterStatus.operating_time).label("total_avg")
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                func.Date(planterModels.PlanterStatus.updated_at) == yesterday,
            )
            .scalar()
        )

        if not total_planter_status_operating_time:
            total_avg = 0
        else:
            total_avg = int(total_planter_status_operating_time)

        operating_time_farmhouse = (
            db.query(
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterStatus.operating_time).label(
                    "sum_operating_time"
                ),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterStatus,
                planterModels.Planter.id == planterModels.PlanterStatus.planter_id,
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                func.Date(planterModels.PlanterStatus.updated_at) == yesterday,
            )
            .group_by(authModels.FarmHouse.name)
            .order_by(desc("sum_operating_time"))
            .all()
        )

    elif query_type == "month":
        this_month_first_day = utc_now.date().replace(day=1)
        last_month = this_month_first_day - timedelta(days=1)

        total_planter_status_operating_time = (
            db.query(
                func.avg(planterModels.PlanterStatus.operating_time).label("total_avg")
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                extract("year", planterModels.PlanterStatus.updated_at)
                == last_month.year,
                extract("month", planterModels.PlanterStatus.updated_at)
                == last_month.month,
            )
            .scalar()
        )

        if not total_planter_status_operating_time:
            total_avg = 0
        else:
            total_avg = int(total_planter_status_operating_time)

        operating_time_farmhouse = (
            db.query(
                authModels.FarmHouse.name,
                func.sum(planterModels.PlanterStatus.operating_time).label(
                    "sum_operating_time"
                ),
            )
            .join(
                planterModels.Planter,
                authModels.FarmHouse.id == planterModels.Planter.farm_house_id,
            )
            .join(
                planterModels.PlanterStatus,
                planterModels.Planter.id == planterModels.PlanterStatus.planter_id,
            )
            .filter(
                planterModels.PlanterStatus.status == "OFF",
                planterModels.PlanterStatus.operating_time != 0,
                extract("year", planterModels.PlanterStatus.updated_at)
                == last_month.year,
                extract("month", planterModels.PlanterStatus.updated_at)
                == last_month.month,
            )
            .group_by(authModels.FarmHouse.name)
            .order_by(desc("sum_operating_time"))
            .all()
        )
    else:
        return JSONResponse(status_code=433, content=dict(msg="UNPROCESSABLE_ENTITY"))

    if not operating_time_farmhouse:
        max_farmhouse_name = None
        max_farmhouse_sum_operating_time = 0
        min_farmhouse_name = None
        min_farmhouse_sum_operating_time = 0
    else:
        max_farmhouse_name = operating_time_farmhouse[0][0]
        max_farmhouse_sum_operating_time = operating_time_farmhouse[0][1]
        min_farmhouse_name = operating_time_farmhouse[-1][0]
        min_farmhouse_sum_operating_time = operating_time_farmhouse[-1][1]

    return {
        "total_avg": total_avg,
        "max": {
            "farmhouse_name": max_farmhouse_name,
            "operating_time": max_farmhouse_sum_operating_time,
        },
        "min": {
            "farmhouse_name": min_farmhouse_name,
            "operating_time": min_farmhouse_sum_operating_time,
        },
    }


@router.get(
    "/planter-work/statics",
    description=(
        "관리자 통계현황 페이지 파종기 작업 조회 api<br/>farm_house_id,farmhouse_name,crop_name,tray_total 검색 시 구분값 || 넣어서 요청하기 ex) farm_house_id 중 PF_0021350, PF_0021351 검색하고 싶을 시 farm_house_id='PF_0021350||PF_0021351' 로 요청"
    ),
    status_code=200,
)
def get_planter_work_statics(
    request: Request,
    year: int = None,
    month: int = None,
    date_range: str = None,
    farm_house_id: str = None,
    farmhouse_name: str = None,
    crop_name: str = None,
    crop_kind_order_type: int = None,  # 0: 내림차순, 1: 올림차순
    tray_total: str = None,
    order_quantity_order_type: int = None,  # 0: 내림차순, 1: 올림차순
    planter_output_order_type: int = None,  # 0: 내림차순, 1: 올림차순
    sowing_date_order_type: int = None,  # 0: 내림차순, 1: 올림차순
    is_shipment_completed_order_type: int = 1,  # 0: 내림차순, 1: 올림차순
    page: int = 1,
    size: int = 10,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    base_query = (
        db.query(
            planterModels.PlanterWork.id,
            planterModels.PlanterWork.crop_kind,
            planterModels.PlanterWork.order_quantity,
            planterModels.PlanterWork.sowing_date,
            planterModels.PlanterWork.is_shipment_completed,
            authModels.FarmHouse.farm_house_id,
            authModels.FarmHouse.name.label("farmhouse_name"),
            authModels.FarmHouse.is_del.label("farmhouse_is_del"),
            cropModels.Crop.name.label("crop_name"),
            planterModels.PlanterTray.total,
            planterModels.PlanterOutput.output,
        )
        .join(
            planterModels.Planter,
            planterModels.PlanterWork.planter_id == planterModels.Planter.id,
        )
        .join(
            authModels.FarmHouse,
            planterModels.Planter.farm_house_id == authModels.FarmHouse.id,
        )
        .join(cropModels.Crop, planterModels.PlanterWork.crop_id == cropModels.Crop.id)
        .join(
            planterModels.PlanterTray,
            planterModels.PlanterWork.planter_tray_id == planterModels.PlanterTray.id,
        )
        .join(
            planterModels.PlanterOutput,
            planterModels.PlanterWork.id == planterModels.PlanterOutput.planter_work_id,
        )
    )

    delimiter = "||"

    if date_range:
        target_timezone = timezone("Asia/Seoul")
        start_date, end_date = date_range.split(delimiter)
        start_year, start_month, start_day = start_date.split("-")
        end_year, end_month, end_day = end_date.split("-")

        target_start_date = datetime(
            int(start_year), int(start_month), int(start_day), tzinfo=target_timezone
        ).date()
        target_end_date = datetime(
            int(end_year), int(end_month), int(end_day), tzinfo=target_timezone
        ).date()
        if target_start_date == target_end_date:
            base_query = base_query.filter(
                extract(
                    "year",
                    func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
                )
                == end_year,
                extract(
                    "month",
                    func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
                )
                == end_month,
                extract(
                    "day",
                    func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
                )
                == end_day,
            )
        else:
            base_query = base_query.filter(
                func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at)
                >= target_start_date,
                func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at)
                <= target_end_date,
            )
        # return None
    elif month:
        base_query = base_query.filter(
            extract(
                "year",
                func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
            )
            == year,
            extract(
                "month",
                func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
            )
            == month,
        )
    elif year:
        base_query = base_query.filter(
            extract(
                "year",
                func.timezone("Asia/Seoul", planterModels.PlanterWork.updated_at),
            )
            == year,
        )

    if farm_house_id:
        # search_farm_house_ids = farm_house_id.split(delimiter)
        # farm_house_id_filter_conditions = [
        #     authModels.FarmHouse.farm_house_id.like(f"%{word}%")
        #     for word in search_farm_house_ids
        # ]
        search_farm_house_ids = farm_house_id.split(delimiter)
        base_query = base_query.filter(
            authModels.FarmHouse.farm_house_id.in_(search_farm_house_ids)
        )

    if farmhouse_name:
        search_farmhouse_names = farmhouse_name.split(delimiter)
        base_query = base_query.filter(
            authModels.FarmHouse.name.in_(search_farmhouse_names)
        )
    if crop_name:
        search_crop_names = crop_name.split(delimiter)
        base_query = base_query.filter(cropModels.Crop.name.in_(search_crop_names))
    if tray_total:
        search_tray_totals = tray_total.split(delimiter)
        base_query = base_query.filter(
            planterModels.PlanterTray.total.in_(search_tray_totals)
        )

    order_conditions = []
    if crop_kind_order_type == 0:
        order_conditions.append(desc(planterModels.PlanterWork.crop_kind))
    elif crop_kind_order_type == 1:
        order_conditions.append(asc(planterModels.PlanterWork.crop_kind))
    if order_quantity_order_type == 0:
        order_conditions.append(desc(planterModels.PlanterWork.order_quantity))
    elif order_quantity_order_type == 1:
        order_conditions.append(asc(planterModels.PlanterWork.order_quantity))
    if planter_output_order_type == 0:
        order_conditions.append(desc(planterModels.PlanterOutput.output))
    elif planter_output_order_type == 1:
        order_conditions.append(asc(planterModels.PlanterOutput.output))
    if sowing_date_order_type == 0:
        order_conditions.append(desc(planterModels.PlanterWork.sowing_date))
    elif sowing_date_order_type == 1:
        order_conditions.append(asc(planterModels.PlanterWork.sowing_date))
    # if sowing_date_order_type == 0:
    #     order_conditions.append(desc(planterModels.PlanterWork.sowing_date))
    # else:
    #     order_conditions.append(asc(planterModels.PlanterWork.sowing_date))
    if is_shipment_completed_order_type == 0:
        order_conditions.append(desc(planterModels.PlanterWork.is_shipment_completed))
    elif is_shipment_completed_order_type == 1:
        order_conditions.append(asc(planterModels.PlanterWork.is_shipment_completed))

    base_query = base_query.order_by(*order_conditions)

    total = base_query.count()
    result_data = []
    for result in base_query.offset(page * size).limit(size).all():
        result_data.append(
            {
                "id": result.id,
                "crop_kind": result.crop_kind,
                "order_quantity": result.order_quantity,
                "sowing_date": result.sowing_date,
                "is_shipment_completed": result.is_shipment_completed,
                "farmhouse": {
                    "farm_house_id": result.farm_house_id,
                    "name": result.farmhouse_name,
                    "is_del": result.farmhouse_is_del,
                },
                "crop": {"name": result.crop_name},
                "planter_tray": {"total": result.total},
                "planter_output": {"output": result.output},
            }
        )

    return {"total": total, "data": result_data}


@router.get(
    "/search/planter-tray-total",
    description="관리자용 파종기 트레이 총 홀 수 검색 api",
    status_code=200,
)
def search_planter_tray_total_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    planter_tray_total_query = db.query(planterModels.PlanterTray.total)

    if search:
        planter_tray_total_query = planter_tray_total_query.filter(
            cast(planterModels.PlanterTray.total, String).like(f"%{search}%")
        )

    planter_tray_total_query = planter_tray_total_query.order_by(
        planterModels.PlanterTray.total.asc()
    ).all()

    planter_tray_total_response = [result[0] for result in planter_tray_total_query]

    return planter_tray_total_response


@router.patch(
    "/tray/update/{tray_id}",
    description="관리자 트레이 수정 api",
)
def update_planter_tray(
    request: Request,
    tray_id: int,
    tray_data: planterAdminSchemas.PlanterTrayUpdate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    planter_tray = get_(db, planterModels.PlanterTray, id=tray_id)

    for field in tray_data.__dict__:
        if getattr(tray_data, field) is not None:
            setattr(planter_tray, field, getattr(tray_data, field))

    db.commit()
    db.refresh(planter_tray)
    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))


@router.patch(
    "/tray/multiple/delete/{tray_ids}",
    description="트레이 목록 다중 선택 후 삭제 api<br/> tray_ids = '1||2||3||4||5||6' 의 형태로 데이터 보내기",
    status_code=200,
)
def delete_multiple_planter_trays(
    request: Request, tray_ids: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    target_ids = tray_ids.split("||")

    base_query = (
        db.query(planterModels.PlanterTray)
        .filter(planterModels.PlanterTray.id.in_(target_ids))
        .all()
    )

    tray_updates = []

    for tray in base_query:
        tray_updates.append({"id": tray.id, "is_del": True})

    db.bulk_update_mappings(planterModels.PlanterTray, tray_updates)
    db.commit()

    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
