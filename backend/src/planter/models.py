from sqlalchemy import (
    Column,
    String,
    Integer,
    Boolean,
    DateTime,
    ForeignKey,
    BigInteger,
)
from sqlalchemy.orm import relationship

from utils.database import BaseModel


class Planter(BaseModel):
    __tablename__ = "planters"

    farm_house_id = Column(Integer, ForeignKey("farm_houses.id"))
    id = Column(Integer, primary_key=True, index=True)
    serial_number = Column(String(length=255), unique=True, nullable=True)
    is_register = Column(Boolean, default=False)
    register_date = Column(DateTime(timezone=True), nullable=True)
    qrcode = Column(String)

    planter_farm_house = relationship("FarmHouse", back_populates="farm_house_planter")
    planter__planter_status = relationship(
        "PlanterStatus",
        back_populates="planter_status__planter",
        primaryjoin="Planter.id == PlanterStatus.planter_id",
    )

    planter__planter_work = relationship(
        "PlanterWork",
        back_populates="planter_work__planter",
        primaryjoin="Planter.id == PlanterWork.planter_id",
    )


class PlanterTray(BaseModel):
    __tablename__ = "planter_trays"

    id = Column(Integer, primary_key=True, index=True)
    width = Column(Integer)
    height = Column(Integer)
    total = Column(Integer)

    planter_tray__planter_work = relationship(
        "PlanterWork",
        back_populates="planter_work__planter_tray",
        primaryjoin="PlanterTray.id == PlanterWork.planter_tray_id",
    )


class PlanterStatus(BaseModel):
    __tablename__ = "planter_status"

    id = Column(Integer, primary_key=True, index=True)
    planter_id = Column(Integer, ForeignKey("planters.id"))
    status = Column(String(length=5))  # OFF, ON, PAUSE
    operating_time = Column(BigInteger, default=0)

    planter_status__planter = relationship(
        "Planter", back_populates="planter__planter_status"
    )


class PlanterWork(BaseModel):
    __tablename__ = "planter_works"

    id = Column(Integer, primary_key=True, index=True)
    planter_id = Column(Integer, ForeignKey("planters.id"))
    planter_tray_id = Column(Integer, ForeignKey("planter_trays.id"))
    crop_id = Column(Integer, ForeignKey("crops.id"))
    crop_kind = Column(String(length=255), index=True)
    sowing_date = Column(DateTime(timezone=True))
    deadline = Column(DateTime(timezone=True))
    order_quantity = Column(BigInteger)
    seed_quantity = Column(BigInteger)
    is_shipment_completed = Column(Boolean, default=False)
    # operating_time = Column(BigInteger, nullable=True, default=0)

    planter_work__planter = relationship(
        "Planter", back_populates="planter__planter_work"
    )
    planter_work__planter_tray = relationship(
        "PlanterTray", back_populates="planter_tray__planter_work"
    )
    planter_work__crop = relationship("Crop", back_populates="crop__planter_work")
    planter_work__planter_work_status = relationship(
        "PlanterWorkStatus",
        back_populates="planter_work_status__planter_work",
        primaryjoin="PlanterWork.id == PlanterWorkStatus.planter_work_id",
    )
    planter_works__planter_output = relationship(
        "PlanterOutput",
        uselist=False,
        back_populates="planter_output__planter_works",
        primaryjoin="PlanterWork.id == PlanterOutput.planter_work_id",
    )


class PlanterWorkStatus(BaseModel):
    __tablename__ = "planter_work_status"

    id = Column(Integer, primary_key=True, index=True)
    planter_work_id = Column(Integer, ForeignKey("planter_works.id"))
    status = Column(String(length=7))  # WAIT, WORKING, DONE, PAUSE

    planter_work_status__planter_work = relationship(
        "PlanterWork", back_populates="planter_work__planter_work_status"
    )


class PlanterOutput(BaseModel):
    __tablename__ = "planter_outputs"

    id = Column(Integer, primary_key=True, index=True)
    planter_work_id = Column(Integer, ForeignKey("planter_works.id"))
    start_count = Column(Integer, nullable=True, default=None)
    end_count = Column(Integer, nullable=True, default=0)
    output = Column(BigInteger, default=0)

    planter_output__planter_works = relationship(
        "PlanterWork", back_populates="planter_works__planter_output"
    )
