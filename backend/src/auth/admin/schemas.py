from pydantic import BaseModel
from typing import Optional


class AdminUserInfoBase(BaseModel):
    company: str
    department: str
    position: str
    phone: str


class AdminUserInfoCreate(AdminUserInfoBase):
    pass


class AdminUserInfoUpdate(BaseModel):
    company: Optional[str] = None
    department: Optional[str] = None
    position: Optional[str] = None
    phone: Optional[str] = None
    is_del: Optional[bool] = None
