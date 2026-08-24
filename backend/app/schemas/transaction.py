import datetime as dt
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator, field_validator

TransactionType = Literal["expense", "income", "transfer"]


class TransactionPayload(BaseModel):
    date: dt.date
    description: str = Field(min_length=1, max_length=255)
    type: TransactionType
    amount: Decimal = Field(gt=0, max_digits=14, decimal_places=2)
    source_account_id: int | None = None
    destination_account_id: int | None = None
    category_id: int | None = None
    notes: str | None = Field(default=None, max_length=2000)

    @field_validator("description")
    @classmethod
    def clean_description(cls, value: str) -> str:
        return value.strip()

    @model_validator(mode="after")
    def validate_accounts(self):
        if self.type == "expense":
            if self.source_account_id is None:
                raise ValueError("Une dépense doit avoir un compte source")
            if self.destination_account_id is not None:
                raise ValueError("Une dépense ne doit pas avoir de compte destination")
        if self.type == "income":
            if self.destination_account_id is None:
                raise ValueError("Un revenu doit avoir un compte destination")
            if self.source_account_id is not None:
                raise ValueError("Un revenu ne doit pas avoir de compte source")
        if self.type == "transfer":
            if self.source_account_id is None or self.destination_account_id is None:
                raise ValueError("Un transfert doit avoir un compte source et destination")
            if self.source_account_id == self.destination_account_id:
                raise ValueError("Les comptes source et destination doivent être différents")
        return self


class TransactionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    date: dt.date
    description: str
    type: str
    amount: Decimal
    source_account_id: int | None
    source_account_name: str | None = None
    destination_account_id: int | None
    destination_account_name: str | None = None
    category_id: int | None
    category_name: str | None = None
    category_color: str | None = None
    notes: str | None
    created_at: dt.datetime
    updated_at: dt.datetime
