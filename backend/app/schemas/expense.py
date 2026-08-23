import datetime as dt
from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ExpenseCategory(str, Enum):
    HOUSING = "Logement"
    GROCERIES = "Courses"
    TRANSPORT = "Transport"
    BILLS = "Factures"
    LEISURE = "Loisirs"
    SUBSCRIPTIONS = "Abonnements"
    SHOPPING = "Shopping"
    OTHER = "Autre"


class ExpenseCreate(BaseModel):
    date: dt.date
    description: str = Field(max_length=255)
    amount: Decimal = Field(
        gt=0,
        max_digits=12,
        decimal_places=2,
    )
    category: ExpenseCategory

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Description must not be empty")

        return value


class ExpenseRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: dt.date
    description: str
    amount: Decimal
    category: ExpenseCategory
    created_at: dt.datetime