from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import func, or_, insert

from datetime import datetime, timedelta
from utils.database import get_db, engine
import src.planter.models as planterModels

Schedule = BackgroundScheduler(timezone="Asia/Seoul")


def update_planter_work_deadline():
    db = next(get_db())

    today = datetime.utcnow()
    planter_work_over_deadline = (
        db.query(planterModels.PlanterWork.id)
        .filter(
            planterModels.PlanterWork.is_del == False,
            or_(
                planterModels.PlanterWork.is_shipment_completed == False,
                planterModels.PlanterWork.is_shipment_completed == None,
            ),
            func.Date(planterModels.PlanterWork.deadline) <= today.utcnow(),
        )
        .all()
    )

    if planter_work_over_deadline:
        pw_updates = []
        for pw in planter_work_over_deadline:
            pw_updates.append({"id": pw.id, "is_shipment_completed": True})

        db.bulk_update_mappings(planterModels.PlanterWork, pw_updates)
        db.commit()


def update_planter_status_to_off():
    db = next(get_db())

    before_thirty = datetime.utcnow() - timedelta(minutes=30)

    subq = (
        db.query(
            planterModels.PlanterStatus.planter_id,
            func.max(planterModels.PlanterStatus.status).label("last_status"),
            func.max(planterModels.PlanterStatus.updated_at).label("max_updated_at"),
        )
        # .filter(
        #     planterModels.PlanterStatus.is_del == False,
        # )
        .group_by(
            planterModels.PlanterStatus.planter_id,
        ).subquery()
    )
    planter_status = (
        db.query(planterModels.PlanterStatus)
        .join(
            subq,
            (planterModels.PlanterStatus.planter_id == subq.c.planter_id)
            & (planterModels.PlanterStatus.updated_at == subq.c.max_updated_at),
        )
        .filter(
            planterModels.PlanterStatus.status == "ON",
            planterModels.PlanterStatus.updated_at <= before_thirty,
        )
        .all()
    )

    if planter_status:
        # INFO: sqlalchemy core 사용
        save_data = insert(planterModels.PlanterStatus).values(
            [
                {
                    "planter_id": status.planter_id,
                    "status": "OFF",
                    "operating_time": status.operating_time,
                }
                for status in planter_status
            ]
        )
        db.execute(save_data)
        db.commit()


# Schedule.add_job(
#     update_planter_status_to_off,
#     "interval",
#     seconds=3,
#     id="update_planter_status_to_off",
# )

Schedule.add_job(
    update_planter_work_deadline,
    "cron",
    hour="0",
    minute="0",
    id="update_planter_work_deadline",
)

Schedule.add_job(
    update_planter_status_to_off,
    "interval",
    minutes=30,
    id="update_planter_status_to_off",
)
