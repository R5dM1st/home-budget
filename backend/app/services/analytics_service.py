import datetime as dt
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.analytics import (
    CategorySpending,
    DailySpending,
    MonthlySummary,
)
from app.services import budget_service


def get_month_bounds(
    year: int,
    month: int,
) -> tuple[dt.date, dt.date]:
    start_date = dt.date(year, month, 1)

    if month == 12:
        end_date = dt.date(year + 1, 1, 1)
    else:
        end_date = dt.date(year, month + 1, 1)

    return start_date, end_date

def get_spending_by_category(
    db: Session,
    year: int,
    month: int,
) -> list[CategorySpending]:
    start_date, end_date = get_month_bounds(year, month)

    statement = (
        select(
            Expense.category,
            func.sum(Expense.amount).label("amount"),
            func.count(Expense.id).label("transaction_count"),
        )
        .where(
            Expense.date >= start_date,
            Expense.date < end_date,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
    )

    rows = db.execute(statement).all()

    return [
        CategorySpending(
            category=row.category,
            amount=row.amount,
            transaction_count=row.transaction_count,
        )
        for row in rows
    ]


def get_daily_spending(
    db: Session,
    year: int,
    month: int,
) -> list[DailySpending]:
    start_date, end_date = get_month_bounds(year, month)

    statement = (
        select(
            Expense.date,
            func.sum(Expense.amount).label("amount"),
            func.count(Expense.id).label("transaction_count"),
        )
        .where(
            Expense.date >= start_date,
            Expense.date < end_date,
        )
        .group_by(Expense.date)
        .order_by(Expense.date.asc())
    )

    rows = db.execute(statement).all()

    return [
        DailySpending(
            date=row.date,
            amount=row.amount,
            transaction_count=row.transaction_count,
        )
        for row in rows
    ]

def get_monthly_summary(
    db: Session,
    year: int,
    month: int,
) -> MonthlySummary:
    start_date, end_date = get_month_bounds(year, month)

    expense_filter = (
        Expense.date >= start_date,
        Expense.date < end_date,
    )

    total_spent = db.scalar(
        select(func.sum(Expense.amount)).where(*expense_filter)
    )

    if total_spent is None:
        total_spent = Decimal("0.00")

    transaction_count = db.scalar(
        select(func.count(Expense.id)).where(*expense_filter)
    ) or 0

    if transaction_count == 0:
        average_expense = Decimal("0.00")
    else:
        average_expense = (
            total_spent / transaction_count
        ).quantize(Decimal("0.01"))

    budget = budget_service.get_budget(db, year, month)

    if budget is None:
        budget_amount = None
        remaining = None
        percentage_used = None
    else:
        budget_amount = budget.amount
        remaining = budget.amount - total_spent

        if budget.amount == 0:
            percentage_used = None
        else:
            percentage_used = (
                total_spent
                / budget.amount
                * Decimal("100")
            ).quantize(Decimal("0.01"))

    return MonthlySummary(
        year=year,
        month=month,
        budget=budget_amount,
        total_spent=total_spent,
        remaining=remaining,
        percentage_used=percentage_used,
        transaction_count=transaction_count,
        average_expense=average_expense,
    )