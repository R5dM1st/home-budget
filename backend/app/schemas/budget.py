import datetime as dt
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class BudgetUpdate(BaseModel):
    amount: Decimal = Field(ge=0, max_digits=14, decimal_places=2)


class BudgetRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    year: int
    month: int
    amount: Decimal
    created_at: dt.datetime
    updated_at: dt.datetime


class BudgetLimitUpdate(BaseModel):
    amount: Decimal = Field(ge=0, max_digits=14, decimal_places=2)


class BudgetLimitRead(BaseModel):
    id: int
    year: int
    month: int
    category_id: int
    category_name: str
    category_color: str
    amount: Decimal
    spent: Decimal
    remaining: Decimal
    percentage_used: Decimal | None
