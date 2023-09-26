from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse


from utils.database import get_db
from utils.db_shortcuts import get_current_user, get_
from utils.file_upload import single_file_uploader, delete_file
import src.crops.models as cropModels


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
