from pydantic import BaseModel
from typing import Optional, List


class DashboardResponse(BaseModel):
    farmhouse_count: int
    crop_count: int
    planter_count: int
    total_output: int


class PlanterTrayUpdate(BaseModel):
    width: Optional[int]
    height: Optional[int]
    total: Optional[int]
    is_del: Optional[bool]
