import datetime as dt
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class MonthlySummary(BaseModel):
    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "year": 2026,
                    "month": 8,
                    "budget": "2000.00",
                    "total_spent": "73.40",
                    "remaining": "1926.60",
                    "percentage_used": "3.67",
                    "transaction_count": 2,
                    "average_expense": "36.70",
                }
            ]
        }
    )

    year: int
    month: int
    budget: Decimal | None
    total_spent: Decimal
    remaining: Decimal | None
    percentage_used: Decimal | None
    transaction_count: int
    average_expense: Decimal


class CategorySpending(BaseModel):
    category: str
    amount: Decimal
    transaction_count: int


class DailySpending(BaseModel):
    date: dt.date
    amount: Decimal
    transaction_count: int