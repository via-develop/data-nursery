from pydantic import BaseModel
from typing import Optional, List


class CropUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    image: Optional[str] = None
    is_del: Optional[bool] = None
