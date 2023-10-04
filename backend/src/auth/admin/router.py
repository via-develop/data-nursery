from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse
import bcrypt
import pandas as pd

from utils.database import get_db
from utils.db_shortcuts import get_current_user, create_, get_
import src.auth.models as authModels
import src.planter.models as planterModels
import src.auth.schemas as authSchemas
import src.auth.admin.schemas as authAdminSchemas


router = APIRouter()


@router.get("/search/farm_house_id", description="관리자용 농가ID 검색 api", status_code=200)
def search_farm_house_id_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    farm_house_id_query = db.query(authModels.FarmHouse.farm_house_id).filter(
        authModels.FarmHouse.is_del == False
    )

    if search:
        farm_house_id_query = farm_house_id_query.filter(
            authModels.FarmHouse.farm_house_id.like(f"%{search}%")
        )

    farm_house_id_query = farm_house_id_query.order_by(
        authModels.FarmHouse.farm_house_id.asc()
    ).all()

    farm_house_id_response = [result[0] for result in farm_house_id_query]

    return farm_house_id_response


@router.get("/search/farmhouse_name", description="관리자용 농가명 검색 api", status_code=200)
def search_farmhouse_name_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    farmhouse_name_query = db.query(authModels.FarmHouse.name).filter(
        authModels.FarmHouse.is_del == False
    )

    if search:
        farmhouse_name_query = farmhouse_name_query.filter(
            authModels.FarmHouse.name.like(f"%{search}%")
        )

    farmhouse_name_query = farmhouse_name_query.order_by(
        authModels.FarmHouse.name.asc()
    ).all()

    farmhouse_name_response = [result[0] for result in farmhouse_name_query]

    return farmhouse_name_response


@router.post("/admin/create", description="관리자 추가 api", status_code=200)
def create_admin_user(
    request: Request,
    user_data: authSchemas.UserCreate,
    admin_user_info_data: authAdminSchemas.AdminUserInfoCreate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    if user_data.code != "99":
        return JSONResponse(status_code=400, content=dict(msg="NOT_CRAETED_USER_CODE"))

    user_data.password = bcrypt.hashpw(
        user_data.password.encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = create_(
        db,
        authModels.User,
        login_id=user_data.login_id,
        name=user_data.name,
        password=user_data.password,
        code=user_data.code,
    )

    new_admin_user_info = create_(
        db,
        authModels.AdminUserInfo,
        admin_user_info__user=new_user,
        company=admin_user_info_data.company,
        department=admin_user_info_data.department,
        position=admin_user_info_data.position,
        phone=admin_user_info_data.phone,
    )

    db.add(new_user)
    db.add(new_admin_user_info)
    db.commit()
    db.refresh(new_user)
    db.refresh(new_admin_user_info)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.post("/admin/update/{user_id}", description="관리자 수정 api", status_code=200)
def update_admin_user(
    request: Request,
    user_id: int,
    user_data: authSchemas.UserUpdate,
    admin_user_info_data: authAdminSchemas.AdminUserInfoUpdate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    user = get_(db, authModels.User, id=user_id)
    admin_user_info = user.user__admin_user_info

    for field in user_data.__dict__:
        if getattr(user_data, field) is not None:
            if field == "password":
                setattr(
                    user,
                    field,
                    bcrypt.hashpw(
                        user_data.password.encode("utf-8"), bcrypt.gensalt()
                    ).decode("utf-8"),
                )
            else:
                setattr(user, field, getattr(user_data, field))

    for field in admin_user_info_data.__dict__:
        if getattr(admin_user_info_data, field) is not None:
            setattr(admin_user_info, field, getattr(admin_user_info_data, field))

    db.commit()
    db.refresh(user)
    db.refresh(admin_user_info)

    return JSONResponse(status_code=201, content=dict(msg="SUCCESS"))


@router.get(
    "/admin/user/list",
    description="관리자 목록 리스트 api<br/>page: 요청 페이지, size: 한페이지 데이터 수",
    status_code=200,
)
def get_admin_user_list(
    request: Request, page: int = 1, size: int = 10, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    user_list = (
        db.query(authModels.User, authModels.AdminUserInfo)
        .join(
            authModels.AdminUserInfo,
            authModels.User.id == authModels.AdminUserInfo.user_id,
        )
        .filter(
            authModels.User.is_del == False,
            authModels.User.code == "99",
        )
        .order_by(authModels.AdminUserInfo.is_top_admin.desc())
    )

    total = user_list.count()

    result_data = []

    for user, admin_user_info in user_list.offset(page * size).limit(size).all():
        result_data.append(
            {
                "user": {"id": user.id, "login_id": user.login_id, "name": user.name},
                "admin_user_info": {
                    "id": admin_user_info.id,
                    "company": admin_user_info.company,
                    "department": admin_user_info.department,
                    "position": admin_user_info.position,
                    "phone": admin_user_info.phone,
                    "is_top_admin": admin_user_info.is_top_admin,
                },
            }
        )

    return {"total": total, "data": result_data}


@router.patch(
    "/user/multiple/delete/{user_ids}",
    description="관리자 목록 다중 선택 후 삭제 api<br/> user_ids = '1||2||3||4||5||6' 의 형태로 데이터 보내기",
    status_code=200,
)
def delete_multiple_admin_user(
    request: Request, user_ids: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)
    target_ids = user_ids.split("||")

    base_query = (
        db.query(authModels.User, authModels.AdminUserInfo)
        .join(
            authModels.AdminUserInfo,
            authModels.User.id == authModels.AdminUserInfo.user_id,
        )
        .filter(authModels.User.id.in_(target_ids))
        .all()
    )

    user_updates = []
    admin_user_info_updates = []

    for user, admin_user_info in base_query:
        user_updates.append({"id": user.id, "is_del": True})

        admin_user_info_updates.append({"id": admin_user_info.id, "is_del": True})

    db.bulk_update_mappings(authModels.User, user_updates)
    db.bulk_update_mappings(authModels.AdminUserInfo, admin_user_info_updates)
    db.commit()

    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))


@router.patch(
    "/farmhouse/update/password",
    status_code=200,
)
def update_farm_house_info(
    request: Request,
    farmhouse_id: int,
    new_password: str,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)
    farmhouse = get_(db, authModels.FarmHouse, id=farmhouse_id)

    if not farmhouse:
        return JSONResponse(status_code=404, content=dict(msg="FARMHOUSE_NOT_FOUND"))

    farmhouse_user = farmhouse.farm_house_user

    hash_pw = bcrypt.hashpw(new_password.encode("utf-8"), bcrypt.gensalt())

    farmhouse_user.password = hash_pw.decode("utf-8")

    db.commit()
    db.refresh(farmhouse_user)

    return JSONResponse(status_code=200, content=dict(msg="UPDATE_SUCCESS"))


@router.get("/farmhouse/list/download", description="관리자 페이지 내 농가 목록 Excel 다운로드 시 사용")
def download_farmhouse_list(request: Request, db: Session = Depends(get_db)):
    get_current_user("99", request.cookies, db)

    farmhouse_list = (
        db.query(authModels.FarmHouse, planterModels.Planter.serial_number)
        .join(
            planterModels.Planter,
            planterModels.Planter.farm_house_id == authModels.FarmHouse.id,
        )
        .filter(authModels.FarmHouse.is_del == False)
        .order_by(planterModels.Planter.serial_number.asc())
        .all()
    )

    df = pd.DataFrame(
        [
            [
                serial_number,
                farmhouse.farm_house_id,
                farmhouse.name,
                farmhouse.producer_name,
                farmhouse.nursery_number,
                " ".join(farmhouse.address.split("||")),
                farmhouse.phone,
            ]
            for farmhouse, serial_number in farmhouse_list
        ],
        columns=["파종기 S/N", "농가ID(시설ID)", "농가명", "생산자명", "육묘업등록번호", "주소", "연락처"],
    )

    return StreamingResponse(
        iter([df.to_csv(index=False)]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=farmhouse_list.csv"},
    )
