import datetime as dt
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Integer,
    Numeric,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class MonthlyBudget(Base):
    __tablename__ = "monthly_budgets"

    __table_args__ = (
        UniqueConstraint(
            "year",
            "month",
            name="uq_monthly_budgets_year_month",
        ),
        CheckConstraint(
            "month >= 1 AND month <= 12",
            name="ck_monthly_budgets_month_range",
        ),
        CheckConstraint(
            "amount >= 0",
            name="ck_monthly_budgets_amount_non_negative",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    year: Mapped[int] = mapped_column(Integer, nullable=False)
    month: Mapped[int] = mapped_column(Integer, nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2), nullable=False)
    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
