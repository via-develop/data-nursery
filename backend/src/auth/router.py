from fastapi import APIRouter, Depends, Request, UploadFile, File, Form
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
import bcrypt
from datetime import datetime, timedelta

import src.auth.schemas as schemas
import src.auth.models as models
import src.planter.models as planterModels
import src.planter.schemas as planterSchemas
from utils.db_shortcuts import get_current_user
from utils.database import get_db
from utils.file_upload import single_file_uploader, delete_file
from utils.jwt_utils import create_access_token
from utils.db_shortcuts import get_, create_
from constant.jwt_set import JWT_ACCESS_TOKEN_EXPIRE_DAY
from constant.cookie_set import (
    AUTH_COOKIE_DOMAIN,
    AUTH_COOKIE_SECURE,
    AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
    AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
)


router = APIRouter()


@router.post(
    "/test/sign-up",
    description="docs 접근 유저 생성용입니다.<br/>파종기 정보가 같이 생성되지 않습니다.",
    status_code=201,
    response_model=schemas.User,
)
def sign_up_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if not user.login_id or not user.password:
        return JSONResponse(
            status_code=400, content=dict(msg="ID and password must be provide")
        )

    db_user = (
        db.query(models.User).filter(models.User.login_id == user.login_id).first()
    )
    if db_user:
        return JSONResponse(
            status_code=400, content=dict(msg="This ID is already taken")
        )

    hash_pw = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt())
    new_user = models.User(
        login_id=user.login_id,
        name=user.name,
        password=hash_pw.decode("utf-8"),
        code=user.code,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post(
    "/login",
    description="유저 로그인시 사용합니다.<br/>일반유저(농가)와 관리자유저의 로그인 구분을 l_type의 값으로 판단합니다.<br/>01: 일반유저, 99: 관리자",
    status_code=200,
    response_model=schemas.UserToken,
)
def login_user(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    if not user_data.login_id or not user_data.password:
        return JSONResponse(
            status_code=400, content=dict(msg="ID and password must be provide")
        )

    login_user = (
        db.query(models.User).filter(models.User.login_id == user_data.login_id).first()
    )

    if not login_user:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))

    is_verified = bcrypt.checkpw(
        user_data.password.encode("utf-8"), login_user.password.encode("utf-8")
    )
    if not is_verified:
        return JSONResponse(status_code=400, content=dict(msg="NO_MATCH_USER"))

    # 삭제된 유저인지 판단
    if login_user.is_del:
        return JSONResponse(status_code=400, content=dict(msg="DELETED_USER"))

    access_token = create_access_token(login_user.login_id)

    # l_type == "01" 농가, l_type == "99" 관리자
    if user_data.l_type != login_user.code:
        # 로그인 요청 타입과 유저 타입이 맞지 않는 경우 오류 리턴
        return JSONResponse(status_code=400, content=dict(msg="LOGIN_FAILED"))

    # 농가일 경우 쿠키 설정
    if user_data.l_type == "01":
        farm_house = login_user.user_farm_house
        planter = login_user.user_farm_house.farm_house_planter

        response = JSONResponse(
            status_code=200,
            content={
                "user": {
                    "id": login_user.id,
                    "name": login_user.name,
                },
                "farm_house": {
                    "id": farm_house.id,
                    "name": farm_house.name,
                    "farm_house_id": farm_house.farm_house_id,
                    "producer_name": farm_house.producer_name,
                    "nursery_number": farm_house.nursery_number,
                    "address": farm_house.address,
                    "phone": farm_house.phone,
                },
                "planter": {
                    "id": planter.id,
                    "serial_number": planter.serial_number,
                    "is_register": planter.is_register,
                },
            },
        )

        response.set_cookie(
            key=AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
            value=access_token,
            httponly=True,
            expires=(
                datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
            ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )

    # 관리자일 경우 쿠키 설정
    if user_data.l_type == "99":
        response = JSONResponse(
            status_code=200,
            content={
                "user": {
                    "id": login_user.id,
                    "name": login_user.name,
                },
                "admin_user_info": {
                    "is_top_admin": login_user.user__admin_user_info.is_top_admin
                },
            },
        )

        response.set_cookie(
            key=AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
            value=access_token,
            httponly=True,
            expires=(
                datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
            ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )

    return response


@router.post(
    "/logout",
    description="유저 로그아웃 사용합니다.<br/>일반유저(농가)와 관리자유저의 로그인 구분을 l_type의 값으로 판단합니다.<br/>01: 일반유저, 99: 관리자",
    status_code=200,
)
def login_user(l_type: str, request: Request, db: Session = Depends(get_db)):
    if l_type == "01":
        response = JSONResponse(status_code=200, content={"msg": "SUCCESS"})
        # response.delete_cookie(AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN)
        response.set_cookie(
            key=AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
            httponly=True,
            expires=datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )

    if l_type == "99":
        response = JSONResponse(status_code=200, content={"msg": "SUCCESS"})
        # response.delete_cookie(AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN)
        response.set_cookie(
            key=AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
            httponly=True,
            expires=datetime.utcnow().strftime("%a, %d %b %Y %H:%M:%S GMT"),
            domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
            secure=True if AUTH_COOKIE_SECURE != "False" else False,
            samesite="lax",
        )

    return response


@router.get(
    "/common/user",
    description="일반유저 정보요청 시 사용합니다.<br/>로그인 요청 시 _ta 키를 갖고있는 쿠키가 있어야합니다.<br/>로그인 성공 시 유저 정보를 리턴해줍니다.",
    status_code=200,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("01", request.cookies, db)

    access_token = create_access_token(user.login_id)

    farm_house = user.user_farm_house
    planter = user.user_farm_house.farm_house_planter

    response = JSONResponse(
        status_code=200,
        content={
            "user": {
                "id": user.id,
                "name": user.name,
            },
            "farm_house": {
                "id": farm_house.id,
                "name": farm_house.name,
                "farm_house_id": farm_house.farm_house_id,
                "producer_name": farm_house.producer_name,
                "nursery_number": farm_house.nursery_number,
                "address": farm_house.address,
                "phone": farm_house.phone,
            },
            "planter": {
                "id": planter.id,
                "serial_number": planter.serial_number,
                "is_register": planter.is_register,
            },
        },
    )

    response.set_cookie(
        key=AUTH_COOKIE_COMMON_USER_ACCESS_TOKEN,
        value=access_token,
        httponly=True,
        expires=(
            datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
        ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
        domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
        secure=True if AUTH_COOKIE_SECURE != "False" else False,
        samesite="lax",
    )

    return response


@router.get(
    "/admin/user",
    description="관리자 유저 정보요청 시 사용합니다.<br/>로그인 요청 시 _taa 키를 갖고있는 쿠키가 있어야합니다.<br/>로그인 성공 시 유저 정보를 리턴해줍니다.",
    status_code=200,
)
def get_user(request: Request, db: Session = Depends(get_db)):
    user = get_current_user("99", request.cookies, db)
    access_token = create_access_token(user.login_id)

    response = JSONResponse(
        status_code=200,
        content={
            "user": {
                "id": user.id,
                "name": user.name,
            },
            "admin_user_info": {
                "is_top_admin": user.user__admin_user_info.is_top_admin
            },
        },
    )

    response.set_cookie(
        key=AUTH_COOKIE_ADMIN_USER_ACCESS_TOKEN,
        value=access_token,
        httponly=True,
        expires=(
            datetime.utcnow() + timedelta(days=JWT_ACCESS_TOKEN_EXPIRE_DAY)
        ).strftime("%a, %d %b %Y %H:%M:%S GMT"),
        domain=AUTH_COOKIE_DOMAIN if AUTH_COOKIE_DOMAIN != "None" else None,
        secure=True if AUTH_COOKIE_SECURE != "False" else False,
        samesite="lax",
    )

    return response


@router.post("/farmhouse/create", description="관리자페이지에서 농가 추가할때 사용", status_code=201)
async def create_farm_house(
    request: Request,
    serial_number: str = Form(...),
    nursery_number: str = Form(...),
    farm_house_id: str = Form(...),
    name: str = Form(...),
    producer_name: str = Form(...),
    phone: str = Form(...),
    address: str = Form(...),
    qrcode: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # api 요청한 유저가 관리자 유저인지 확인
    get_current_user("99", request.cookies, db)

    dup_check_user = get_(db, models.User, login_id=serial_number)
    if dup_check_user != None:
        return JSONResponse(status_code=404, content=dict(msg="DUPLICATED_LOGIN_ID"))

    dup_check_farm_house_name = get_(db, models.FarmHouse, name=name)
    if dup_check_farm_house_name != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_NAME")
        )
    dup_check_farm_house_nursery_number = get_(
        db, models.FarmHouse, nursery_number=nursery_number
    )
    if dup_check_farm_house_nursery_number != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_NURSERY_NUMBER")
        )
    dup_check_farm_house_id = get_(db, models.FarmHouse, farm_house_id=farm_house_id)
    if dup_check_farm_house_id != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_FARM_HOUSE_ID")
        )

    dup_check_planter_serial_number = get_(
        db, planterModels.Planter, serial_number=serial_number
    )
    if dup_check_planter_serial_number != None:
        return JSONResponse(
            status_code=404, content=dict(msg="DUPLICATED_PLANTER_SERIAL_NUMBER")
        )

    hash_pw = bcrypt.hashpw(
        phone.replace("-", "").encode("utf-8"), bcrypt.gensalt()
    ).decode("utf-8")

    new_user = create_(
        db,
        models.User,
        login_id=serial_number,
        name=producer_name,
        password=hash_pw,
        code="01",
    )
    new_farm_house = create_(
        db,
        models.FarmHouse,
        farm_house_user=new_user,
        name=name,
        nursery_number=nursery_number,
        farm_house_id=farm_house_id,
        producer_name=producer_name,
        address=address,
        phone=phone,
    )

    saved_qrcode = await single_file_uploader(qrcode)

    if not saved_qrcode["is_success"]:
        return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_QRCODE"))

    new_planter = create_(
        db,
        planterModels.Planter,
        planter_farm_house=new_farm_house,
        serial_number=serial_number,
        qrcode=saved_qrcode["url"],
    )
    new_planter_status = create_(
        db,
        planterModels.PlanterStatus,
        planter_status__planter=new_planter,
        status="OFF",
    )
    try:
        db.add(new_user)
        db.add(new_farm_house)
        db.add(new_planter)
        db.add(new_planter_status)
        db.commit()
        db.refresh(new_user)
        db.refresh(new_farm_house)
        db.refresh(new_planter)
        db.refresh(new_planter_status)
    except Exception as e:
        if saved_qrcode["is_success"]:
            await delete_file(saved_qrcode["url"])
        return JSONResponse(status_code=400, content=dict(msg="CREATED_FAILED"))

    return JSONResponse(status_code=201, content=dict(msg="CREATED_SUCCESS"))


@router.get(
    "/farmhouse/list",
    status_code=200,
    response_model=schemas.PageFarmHouseResponse,
    description="name_order == 0 : 농가이름 오름차순, name_order == 1 : 농가이름 내림차순<br/>status_order == 0 : 파종기 상태 오름차순 (OFF -> ON -> PUASE), status_order == 1 : 파종기 상태 내림차순 (PUASE -> ON -> OFF)<br/>page : 요청할 페이지 번호<br/>size : 한 페이지에 보여줄 갯수",
)
def get_farm_house_list(
    request: Request,
    name_order: int = 0,
    status_order: int = 1,
    db: Session = Depends(get_db),
    page: int = 1,  # 페이지 번호
    size: int = 8,  # 한 페이지에 보여줄 게시물 갯수
):
    get_current_user("99", request.cookies, db)
    # offset 인덱스는 0부터 시작
    if page - 1 < 0:
        page = 0
    else:
        page -= 1

    # name_order == 0 : FarmHouse.name 오름차순
    # name_order == 1 : FarmHouse.name 내림차순
    # status_order == 0 : PlanterStatus.status 오름차순 OFF -> ON -> PAUSE
    # status_order == 1 : PlanterStatus.status 내림차순 PAUSE -> ON -> OFF
    subquery = (
        db.query(
            planterModels.PlanterStatus.planter_id,
            func.max(planterModels.PlanterStatus.id).label("max_status_id"),
        )
        .group_by(planterModels.PlanterStatus.planter_id)
        .subquery()
    )
    farm_houses = (
        db.query(models.FarmHouse)
        .join(planterModels.Planter)
        .outerjoin(subquery, planterModels.Planter.id == subquery.c.planter_id)
        .outerjoin(
            planterModels.PlanterStatus,
            subquery.c.max_status_id == planterModels.PlanterStatus.id,
        )
        .filter(models.FarmHouse.is_del == False)
        .order_by(
            planterModels.PlanterStatus.status.asc()
            if status_order == 0
            else planterModels.PlanterStatus.status.desc(),
            models.FarmHouse.name.asc()
            if name_order == 0
            else models.FarmHouse.name.desc(),
        )
    )

    total = farm_houses.count()

    farm_house_responses = []
    for farm_house in farm_houses.offset(page * size).limit(size).all():
        last_status = (
            db.query(planterModels.PlanterStatus)
            .filter(
                planterModels.PlanterStatus.planter_id
                == farm_house.farm_house_planter.id
            )
            .order_by(planterModels.PlanterStatus.id.desc())
            .first()
        )

        if last_status:
            last_status_response = planterSchemas.PlanterStatus(
                id=last_status.id,
                planter_id=last_status.planter_id,
                status=last_status.status,
            )
        else:
            last_status_response = None

        planter = farm_house.farm_house_planter
        planter_response = planterSchemas.Planter(
            id=planter.id, serial_number=planter.serial_number, qrcode=planter.qrcode
        )

        farm_house_response = schemas.FarmHouseResponse(
            id=farm_house.id,
            name=farm_house.name,
            nursery_number=farm_house.nursery_number,
            farm_house_id=farm_house.farm_house_id,
            producer_name=farm_house.producer_name,
            address=farm_house.address,
            phone=farm_house.phone,
            user_id=farm_house.owner_id,
            planter=planter_response,
            last_planter_status=last_status_response,
        )

        farm_house_responses.append(farm_house_response)

    return {"total": total, "farm_houses": farm_house_responses}


@router.patch(
    "/farmhouse/update",
    status_code=200,
)
def update_farm_house_info(
    request: Request,
    farmhouse_data: schemas.FarmHouseUpdate,
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)
    farmhouse = get_(db, models.FarmHouse, id=farmhouse_data.id)

    if not farmhouse:
        return JSONResponse(status_code=404, content=dict(msg="FARMHOUSE_NOT_FOUND"))

    for field in farmhouse_data.__dict__:
        if getattr(farmhouse_data, field) is not None:
            setattr(farmhouse, field, getattr(farmhouse_data, field))

    db.commit()
    db.refresh(farmhouse)

    return JSONResponse(status_code=200, content=dict(msg="UPDATE_SUCCESS"))


@router.patch(
    "/farmhouse/delete",
    status_code=200,
)
def delete_farmhouse(
    request: Request, farmhouse_ids: str, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    # farmhouse = get_(db, models.FarmHouse, id=farmhouse_id)
    target_ids = farmhouse_ids.split("||")
    farmhouses = (
        db.query(models.FarmHouse).filter(models.FarmHouse.id.in_(target_ids)).all()
    )

    for farmhouse in farmhouses:
        # Farmhouse User 삭제
        user = farmhouse.farm_house_user
        user.is_del = True

        # Famhouse Planter 삭제
        planter = farmhouse.farm_house_planter
        planter.is_del = True

        # Planter status 삭제
        planter_status_list = planter.planter__planter_status
        for planter_status in planter_status_list:
            planter_status.is_del = True

        # PlanterWork 목록 가져오기
        planter_work_list = planter.planter__planter_work

        for planter_work in planter_work_list:
            # PlanterWOrk 삭제
            planter_work.is_del = True
            # lanterWorkStatus 가져오기
            planter_work_status_list = planter_work.planter_work__planter_work_status
            # PlanterWork별 PlanterWorkStatus 가져오기
            for planter_work_status in planter_work_status_list:
                # PlanterWorkStatus 삭제
                planter_work_status.is_del = True
            # PlanterOutput 가져오기
            planter_work_output_list = planter_work.planter_works__planter_output
            # PlanterWork별 PlanterOutput 가져오기
            for planter_work_output in planter_work_output_list:
                # PlanterOutput 삭제
                planter_work_output.is_del = True

        # Farmhouse 삭제
        farmhouse.is_del = True

    db.commit()

    return JSONResponse(status_code=200, content=dict(msg="DELETE_SUCCESS"))
