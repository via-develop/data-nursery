# from apscheduler.schedulers.asyncio import AsyncIOScheduler

# Schedule = AsyncIOScheduler()
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy import func, or_

# from sqlalchemy.orm import
from datetime import datetime
from utils.database import get_db
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


# Schedule.add_job(
#     update_planter_work_deadline,
#     "interval",
#     seconds=3,
#     id="update_planter_work_deadline",
# )
Schedule.add_job(
    update_planter_work_deadline,
    "cron",
    hour="0",
    minute="0",
    id="update_planter_work_deadline",
)
