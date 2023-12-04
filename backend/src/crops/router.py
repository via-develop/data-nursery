from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session


from utils.database import get_db
from utils.db_shortcuts import get_current_user
from utils.file_upload import single_file_uploader
from utils.singletone import ModelSingleTone
import src.crops.schemas as schemas
import src.crops.models as models

router = APIRouter()


@router.post("/create", description="관리자만 추가 가능", status_code=201)
async def crop_create(
    # name: str, color: str, image: UploadFile = File(...), db: Session = Depends(get_db)
    request: Request,
    name: str = Form(...),
    color: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    get_current_user("99", request.cookies, db)

    if image:
        saved_file = await single_file_uploader(image)

        if not saved_file["is_success"]:
            return JSONResponse(status_code=400, content=dict(msg="FAIL_SAVE_DATA"))

        new_crop = models.Crop(name=name, image=saved_file["url"], color=color)
    else:
        new_crop = models.Crop(name=name, color=color)

    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)

    return JSONResponse(status_code=201, content=dict(msg="CROP_CREATE_SUCCESS"))


@router.get("/list", status_code=200, response_model=schemas.MultipleCropsResponse)
def get_crop_list(db: Session = Depends(get_db)):
    crops = (
        db.query(models.Crop)
        .filter_by(is_del=False)
        .order_by(models.Crop.created_at.desc())
        .all()
    )

    return {"crops": crops}
