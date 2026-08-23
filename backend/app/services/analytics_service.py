import datetime as dt
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.analytics import (
    CategorySpending,
    DailySpending,
    MonthlyComparison,
    MonthlySummary,
    TopExpense,
)
from app.services import budget_service

def get_previous_month(
    year: int,
    month: int,
) -> tuple[int, int]:
    if month == 1:
        return year - 1, 12

    return year, month - 1

def get_total_spent(
    db: Session,
    year: int,
    month: int,
) -> Decimal:
    start_date, end_date = get_month_bounds(year, month)

    total = db.scalar(
        select(func.sum(Expense.amount)).where(
            Expense.date >= start_date,
            Expense.date < end_date,
        )
    )

    return total or Decimal("0.00")
def get_top_expenses(
    db: Session,
    year: int,
    month: int,
    limit: int,
) -> list[TopExpense]:
    start_date, end_date = get_month_bounds(year, month)

    statement = (
        select(Expense)
        .where(
            Expense.date >= start_date,
            Expense.date < end_date,
        )
        .order_by(
            Expense.amount.desc(),
            Expense.date.desc(),
        )
        .limit(limit)
    )

    expenses = db.scalars(statement).all()

    return [
        TopExpense(
            id=expense.id,
            date=expense.date,
            description=expense.description,
            category=expense.category,
            amount=expense.amount,
        )
        for expense in expenses
    ]
def get_monthly_comparison(
    db: Session,
    year: int,
    month: int,
) -> MonthlyComparison:
    previous_year, previous_month = get_previous_month(
        year,
        month,
    )

    current_total = get_total_spent(
        db,
        year,
        month,
    )

    previous_total = get_total_spent(
        db,
        previous_year,
        previous_month,
    )

    difference = current_total - previous_total

    if previous_total == 0:
        change_percentage = None
    else:
        change_percentage = (
            difference
            / previous_total
            * Decimal("100")
        ).quantize(Decimal("0.01"))

    return MonthlyComparison(
        year=year,
        month=month,
        previous_year=previous_year,
        previous_month=previous_month,
        current_total=current_total,
        previous_total=previous_total,
        difference=difference,
        change_percentage=change_percentage,
    )
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