import datetime as dt
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class BudgetUpdate(BaseModel):
    amount: Decimal = Field(
        ge=0,
        max_digits=12,
        decimal_places=2,
    )


class BudgetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    year: int
    month: int
    amount: Decimal
    created_at: dt.datetime
    updated_at: dt.datetime