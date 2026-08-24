import datetime as dt
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

AccountType = Literal["checking", "savings", "cash", "credit"]


class AccountPayload(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    type: AccountType
    currency: str = Field(default="EUR", min_length=3, max_length=3)
    opening_balance: Decimal = Field(default=Decimal("0.00"), max_digits=14, decimal_places=2)
    color: str = Field(default="#3569ff", min_length=4, max_length=20)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return value.strip()

    @field_validator("currency")
    @classmethod
    def normalize_currency(cls, value: str) -> str:
        return value.upper()


class AccountRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: str
    currency: str
    opening_balance: Decimal
    balance: Decimal
    color: str
    is_archived: bool
    created_at: dt.datetime
