import datetime as dt
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

RecurringFrequency = Literal["weekly", "monthly", "yearly"]
RecurringType = Literal["expense", "income", "transfer"]


class RecurringPayload(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    description: str = Field(min_length=1, max_length=255)
    type: RecurringType
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    frequency: RecurringFrequency
    next_date: dt.date
    source_account_id: int | None = None
    destination_account_id: int | None = None
    category_id: int | None = None
    notes: str | None = Field(default=None, max_length=2000)
    is_active: bool = True

    @model_validator(mode="after")
    def validate_accounts(self):
        if self.type == "expense":
            if self.source_account_id is None or self.destination_account_id is not None:
                raise ValueError("Une dépense récurrente doit avoir uniquement un compte source")
        if self.type == "income":
            if self.destination_account_id is None or self.source_account_id is not None:
                raise ValueError("Un revenu récurrent doit avoir uniquement un compte destination")
        if self.type == "transfer":
            if self.source_account_id is None or self.destination_account_id is None:
                raise ValueError("Un transfert récurrent doit avoir deux comptes")
            if self.source_account_id == self.destination_account_id:
                raise ValueError("Les comptes du transfert doivent être différents")
            if self.category_id is not None:
                raise ValueError("Un transfert récurrent ne doit pas avoir de catégorie")
        return self


class RecurringRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    type: str
    amount: Decimal
    frequency: str
    next_date: dt.date
    source_account_id: int | None
    destination_account_id: int | None
    category_id: int | None
    notes: str | None
    is_active: bool
    created_at: dt.datetime
    updated_at: dt.datetime


class GenerateRecurringResult(BaseModel):
    generated: int
