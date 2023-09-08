from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from starlette.responses import JSONResponse

import os

from utils.database import get_db
from utils.db_shortcuts import get_current_user, get_
from utils.file_upload import single_file_uploader, delete_file
import src.crops.models as cropModels
from settings import BASE_DIR


router = APIRouter()


@router.get("/search/crop_name", description="관리자용 작물명 검색 api", status_code=200)
def search_crop_name_for_admin(
    request: Request, search: str = None, db: Session = Depends(get_db)
):
    get_current_user("99", request.cookies, db)

    crop_name_query = db.query(cropModels.Crop.name)

    if search:
        crop_name_query = crop_name_query.filter(
            cropModels.Crop.name.like(f"%{search}%")
        )

    crop_name_query = crop_name_query.order_by(cropModels.Crop.name.asc()).all()

    crop_name_response = [result[0] for result in crop_name_query]

    return crop_name_response


@router.patch("/update/{crop_id}", description="관리자 작물 정보 업데이트 api", status_code=200)
async def update_admin_crop_info(
    request: Request,
    crop_id: int,
    name: str = Form(None),
    color: str = Form(None),
    image: UploadFile = File(None),
    is_del: bool = Form(None),
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    crop = get_(db, cropModels.Crop, id=crop_id)

    if not crop:
        return JSONResponse(status_code=404, content=dict(msg="NOT_FOUND_CROP"))

    if name:
        crop.name = name
    if color:
        color.name = color
    if image:
        old_image = crop.image

        saved_file = await single_file_uploader(image)

        if not saved_file["is_success"]:
            return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_DATA"))

        crop.image = saved_file["url"]

    if is_del:
        crop.is_del = is_del

    db.commit()
    db.refresh(crop)

    if image or is_del:
        await delete_file(old_image)

    return JSONResponse(status_code=200, content=dict(msg="SUCCESS"))
