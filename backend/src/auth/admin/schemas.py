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
    company: Optional[str]
    department: Optional[str]
    position: Optional[str]
    phone: Optional[str]
    is_del: Optional[bool]
