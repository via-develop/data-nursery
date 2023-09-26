from pydantic import BaseModel
from typing import Optional, List

from src.planter.schemas import PlanterStatus, Planter


class UserBase(BaseModel):
    login_id: str


class UserCreate(UserBase):
    password: str
    name: str
    code: str | None = "01"


class UserUpdate(BaseModel):
    password: Optional[str] = None
    name: Optional[str] = None
    is_del: Optional[bool] = None


class UserLogin(UserBase):
    password: str
    l_type: str


class User(UserBase):
    id: int
    code: str
    # farm_house: Optional["FarmHouse"] = None

    class Config:
        from_attributes = True


class UserToken(BaseModel):
    access: str
    refresh: str


class FarmHouseBase(BaseModel):
    name: str
    nursery_number: str
    address: str
    phone: str


class FarmHouseCreate(FarmHouseBase):
    owner_id: int


class FarmHouse(FarmHouseBase):
    id: int
    owner: User

    class Config:
        from_attributes = True


class FarmHouseUpdate(BaseModel):
    id: int
    nursery_number: Optional[str] = None
    name: Optional[str] = None
    producer_name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None


class FarmHouseResponse(BaseModel):
    id: int
    name: str
    nursery_number: Optional[str]
    farm_house_id: str
    producer_name: str
    address: str
    phone: str
    user_id: int
    planter: Planter
    last_planter_status: Optional[PlanterStatus]


class PageFarmHouseResponse(BaseModel):
    total: int
    farm_houses: List[FarmHouseResponse]
