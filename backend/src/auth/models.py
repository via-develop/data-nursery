from sqlalchemy import Column, ForeignKey, Integer, String, Text, Boolean
from sqlalchemy.orm import relationship


from utils.database import BaseModel, AppModelBase
from src.planter.models import Planter


class User(BaseModel):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    login_id = Column(String(length=20), unique=True, nullable=True)
    password = Column(String)
    name = Column(String(length=20))
    code = Column(String(length=2), default="01")

    user_farm_house = relationship(
        "FarmHouse",
        uselist=False,
        back_populates="farm_house_user",
        primaryjoin="User.id == FarmHouse.owner_id",
    )
    user__admin_user_info = relationship(
        "AdminUserInfo",
        uselist=False,
        back_populates="admin_user_info__user",
        primaryjoin="User.id == AdminUserInfo.user_id",
    )


class AdminUserInfo(BaseModel):
    __tablename__ = "admin_user_infos"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    company = Column(String(length=30), index=True)
    department = Column(String(length=30))
    position = Column(String(length=30))
    phone = Column(String(length=20))
    is_top_admin = Column(Boolean, default=False)

    admin_user_info__user = relationship("User", back_populates="user__admin_user_info")


class FarmHouse(BaseModel):
    __tablename__ = "farm_houses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(length=255), unique=True, nullable=True)
    nursery_number = Column(String(length=244), unique=True, nullable=True)
    farm_house_id = Column(String(length=20), unique=True, nullable=True)
    producer_name = Column(String(length=20))
    address = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    phone = Column(String(length=20))

    farm_house_user = relationship("User", back_populates="user_farm_house")
    farm_house_planter = relationship(
        "Planter",
        uselist=False,
        back_populates="planter_farm_house",
        primaryjoin="FarmHouse.id == Planter.farm_house_id",
    )
