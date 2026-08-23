from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.monthly_budget import MonthlyBudget
from app.schemas.budget import BudgetUpdate


def list_budgets(db: Session) -> list[MonthlyBudget]:
    statement = select(MonthlyBudget).order_by(
        MonthlyBudget.year.desc(),
        MonthlyBudget.month.desc(),
    )

    return list(db.scalars(statement).all())


def get_budget(
    db: Session,
    year: int,
    month: int,
) -> MonthlyBudget | None:
    statement = select(MonthlyBudget).where(
        MonthlyBudget.year == year,
        MonthlyBudget.month == month,
    )

    return db.scalar(statement)


def set_budget(
    db: Session,
    year: int,
    month: int,
    budget_data: BudgetUpdate,
) -> MonthlyBudget:
    budget = get_budget(db, year, month)

    if budget is None:
        budget = MonthlyBudget(
            year=year,
            month=month,
            amount=budget_data.amount,
        )
        db.add(budget)
    else:
        budget.amount = budget_data.amount

    db.commit()
    db.refresh(budget)

    return budget