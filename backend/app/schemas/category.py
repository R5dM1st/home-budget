import datetime as dt
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator

CategoryType = Literal["expense", "income"]


class CategoryPayload(BaseModel):
    name: str = Field(min_length=1, max_length=80)
    type: CategoryType
    icon: str = Field(default="circle", max_length=40)
    color: str = Field(default="#64748b", max_length=20)

    @field_validator("name")
    @classmethod
    def clean_name(cls, value: str) -> str:
        return value.strip()


class CategoryRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    type: str
    icon: str
    color: str
    created_at: dt.datetime
