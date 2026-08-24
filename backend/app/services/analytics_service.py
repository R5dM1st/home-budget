import datetime as dt
from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.analytics import (
    AccountBalance,
    CategorySpending,
    DailyCashFlow,
    DashboardSummary,
    MonthlyPoint,
)
from app.services import account_service, budget_service


def month_bounds(year: int, month: int) -> tuple[dt.date, dt.date]:
    start = dt.date(year, month, 1)
    end = dt.date(year + 1, 1, 1) if month == 12 else dt.date(year, month + 1, 1)
    return start, end


def get_dashboard_summary(db: Session, year: int, month: int) -> DashboardSummary:
    start, end = month_bounds(year, month)
    expenses = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).where(
            Transaction.type == "expense",
            Transaction.date >= start,
            Transaction.date < end,
        )
    ) or Decimal("0.00")
    income = db.scalar(
        select(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).where(
            Transaction.type == "income",
            Transaction.date >= start,
            Transaction.date < end,
        )
    ) or Decimal("0.00")
    transaction_count = db.scalar(
        select(func.count(Transaction.id)).where(
            Transaction.date >= start,
            Transaction.date < end,
        )
    ) or 0
    accounts = account_service.list_accounts(db)
    net_worth = sum((item.balance for item in accounts), Decimal("0.00"))
    budget = budget_service.get_budget(db, year, month)
    budget_amount = budget.amount if budget else None
    remaining = None if budget_amount is None else budget_amount - expenses
    percentage = None
    if budget_amount not in (None, Decimal("0.00")):
        percentage = (expenses / budget_amount * Decimal("100")).quantize(Decimal("0.01"))
    return DashboardSummary(
        year=year,
        month=month,
        budget=budget_amount,
        expenses=expenses,
        income=income,
        cash_flow=income - expenses,
        remaining=remaining,
        percentage_used=percentage,
        net_worth=net_worth,
        transaction_count=transaction_count,
        account_count=len(accounts),
    )


def get_category_spending(db: Session, year: int, month: int) -> list[CategorySpending]:
    start, end = month_bounds(year, month)
    statement = (
        select(
            Transaction.category_id,
            func.coalesce(Category.name, "Sans catégorie"),
            func.coalesce(Category.color, "#94a3b8"),
            func.sum(Transaction.amount),
            func.count(Transaction.id),
        )
        .outerjoin(Category, Transaction.category_id == Category.id)
        .where(
            Transaction.type == "expense",
            Transaction.date >= start,
            Transaction.date < end,
        )
        .group_by(Transaction.category_id, Category.name, Category.color)
        .order_by(func.sum(Transaction.amount).desc())
    )
    return [
        CategorySpending(
            category_id=category_id,
            category=category,
            color=color,
            amount=amount,
            transaction_count=count,
        )
        for category_id, category, color, amount, count in db.execute(statement).all()
    ]


def get_daily_cash_flow(db: Session, year: int, month: int) -> list[DailyCashFlow]:
    start, end = month_bounds(year, month)
    statement = (
        select(
            Transaction.date,
            func.coalesce(
                func.sum(case((Transaction.type == "expense", Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("expenses"),
            func.coalesce(
                func.sum(case((Transaction.type == "income", Transaction.amount), else_=Decimal("0.00"))),
                Decimal("0.00"),
            ).label("income"),
        )
        .where(Transaction.date >= start, Transaction.date < end)
        .group_by(Transaction.date)
        .order_by(Transaction.date.asc())
    )
    return [DailyCashFlow(date=date, expenses=expenses, income=income) for date, expenses, income in db.execute(statement).all()]


def get_account_balances(db: Session) -> list[AccountBalance]:
    return [
        AccountBalance(
            account_id=item.id,
            name=item.name,
            type=item.type,
            color=item.color,
            currency=item.currency,
            balance=item.balance,
        )
        for item in account_service.list_accounts(db)
    ]


def get_monthly_history(db: Session, year: int, month: int, months: int = 6) -> list[MonthlyPoint]:
    points: list[MonthlyPoint] = []
    cursor_year, cursor_month = year, month
    periods: list[tuple[int, int]] = []
    for _ in range(months):
        periods.append((cursor_year, cursor_month))
        if cursor_month == 1:
            cursor_year -= 1
            cursor_month = 12
        else:
            cursor_month -= 1
    for period_year, period_month in reversed(periods):
        start, end = month_bounds(period_year, period_month)
        expenses = db.scalar(
            select(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).where(
                Transaction.type == "expense",
                Transaction.date >= start,
                Transaction.date < end,
            )
        ) or Decimal("0.00")
        income = db.scalar(
            select(func.coalesce(func.sum(Transaction.amount), Decimal("0.00"))).where(
                Transaction.type == "income",
                Transaction.date >= start,
                Transaction.date < end,
            )
        ) or Decimal("0.00")
        points.append(
            MonthlyPoint(
                year=period_year,
                month=period_month,
                expenses=expenses,
                income=income,
                cash_flow=income - expenses,
            )
        )
    return points
