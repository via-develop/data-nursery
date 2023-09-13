from pydantic import BaseModel
from typing import List


class Crops(BaseModel):
    id: int
    name: str
    image: str | None = None
    color: str

    class Config:
        from_attributes = True


class MultipleCropsResponse(BaseModel):
    crops: List[Crops]
