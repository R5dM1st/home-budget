import datetime as dt
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.budget_limit import BudgetLimit
from app.models.category import Category
from app.models.monthly_budget import MonthlyBudget
from app.models.transaction import Transaction
from app.schemas.budget import BudgetLimitRead, BudgetLimitUpdate, BudgetUpdate


def _bounds(year: int, month: int) -> tuple[dt.date, dt.date]:
    start = dt.date(year, month, 1)
    end = dt.date(year + 1, 1, 1) if month == 12 else dt.date(year, month + 1, 1)
    return start, end


def list_budgets(db: Session) -> list[MonthlyBudget]:
    statement = select(MonthlyBudget).order_by(MonthlyBudget.year.desc(), MonthlyBudget.month.desc())
    return list(db.scalars(statement).all())


def get_budget(db: Session, year: int, month: int) -> MonthlyBudget | None:
    return db.scalar(
        select(MonthlyBudget).where(
            MonthlyBudget.year == year,
            MonthlyBudget.month == month,
        )
    )


def set_budget(db: Session, year: int, month: int, payload: BudgetUpdate) -> MonthlyBudget:
    budget = get_budget(db, year, month)
    if budget is None:
        budget = MonthlyBudget(year=year, month=month, amount=payload.amount)
        db.add(budget)
    else:
        budget.amount = payload.amount
    db.commit()
    db.refresh(budget)
    return budget


def list_limits(db: Session, year: int, month: int) -> list[BudgetLimitRead]:
    start, end = _bounds(year, month)
    spent_subquery = (
        select(
            Transaction.category_id.label("category_id"),
            func.coalesce(func.sum(Transaction.amount), Decimal("0.00")).label("spent"),
        )
        .where(
            Transaction.type == "expense",
            Transaction.date >= start,
            Transaction.date < end,
        )
        .group_by(Transaction.category_id)
        .subquery()
    )
    statement = (
        select(BudgetLimit, Category, func.coalesce(spent_subquery.c.spent, Decimal("0.00")))
        .join(Category, BudgetLimit.category_id == Category.id)
        .outerjoin(spent_subquery, spent_subquery.c.category_id == BudgetLimit.category_id)
        .where(BudgetLimit.year == year, BudgetLimit.month == month)
        .order_by(Category.name.asc())
    )
    result: list[BudgetLimitRead] = []
    for limit, category, spent in db.execute(statement).all():
        remaining = limit.amount - spent
        percentage = None if limit.amount == 0 else (spent / limit.amount * Decimal("100")).quantize(Decimal("0.01"))
        result.append(
            BudgetLimitRead(
                id=limit.id,
                year=year,
                month=month,
                category_id=category.id,
                category_name=category.name,
                category_color=category.color,
                amount=limit.amount,
                spent=spent,
                remaining=remaining,
                percentage_used=percentage,
            )
        )
    return result


def set_limit(
    db: Session, year: int, month: int, category_id: int, payload: BudgetLimitUpdate
) -> BudgetLimit:
    limit = db.scalar(
        select(BudgetLimit).where(
            BudgetLimit.year == year,
            BudgetLimit.month == month,
            BudgetLimit.category_id == category_id,
        )
    )
    if limit is None:
        limit = BudgetLimit(
            year=year,
            month=month,
            category_id=category_id,
            amount=payload.amount,
        )
        db.add(limit)
    else:
        limit.amount = payload.amount
    db.commit()
    db.refresh(limit)
    return limit


def delete_limit(db: Session, year: int, month: int, category_id: int) -> bool:
    limit = db.scalar(
        select(BudgetLimit).where(
            BudgetLimit.year == year,
            BudgetLimit.month == month,
            BudgetLimit.category_id == category_id,
        )
    )
    if limit is None:
        return False
    db.delete(limit)
    db.commit()
    return True
