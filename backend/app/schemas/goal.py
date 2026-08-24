import datetime as dt
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SavingGoalPayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    target_amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    current_amount: Decimal = Field(default=Decimal("0.00"), ge=0, max_digits=14, decimal_places=2)
    target_date: dt.date | None = None
    account_id: int | None = None
    color: str = Field(default="#7059f5", max_length=20)


class SavingGoalRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    target_amount: Decimal
    current_amount: Decimal
    target_date: dt.date | None
    account_id: int | None
    color: str
    progress_percentage: Decimal
    created_at: dt.datetime
