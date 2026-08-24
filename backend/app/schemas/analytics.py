import datetime as dt
from decimal import Decimal

from pydantic import BaseModel


class DashboardSummary(BaseModel):
    year: int
    month: int
    budget: Decimal | None
    expenses: Decimal
    income: Decimal
    cash_flow: Decimal
    remaining: Decimal | None
    percentage_used: Decimal | None
    net_worth: Decimal
    transaction_count: int
    account_count: int


class CategorySpending(BaseModel):
    category_id: int | None
    category: str
    color: str
    amount: Decimal
    transaction_count: int


class DailyCashFlow(BaseModel):
    date: dt.date
    expenses: Decimal
    income: Decimal


class AccountBalance(BaseModel):
    account_id: int
    name: str
    type: str
    color: str
    currency: str
    balance: Decimal


class MonthlyPoint(BaseModel):
    year: int
    month: int
    expenses: Decimal
    income: Decimal
    cash_flow: Decimal
