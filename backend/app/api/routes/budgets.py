from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.monthly_budget import MonthlyBudget
from app.schemas.budget import BudgetRead, BudgetUpdate


router = APIRouter(
    prefix="/budgets",
    tags=["budgets"],
)

@router.get(
    "",
    response_model=list[BudgetRead],
)
def list_budgets(
    db: Session = Depends(get_db),
) -> list[MonthlyBudget]:
    statement = select(MonthlyBudget).order_by(
        MonthlyBudget.year.desc(),
        MonthlyBudget.month.desc(),
    )

    budgets = db.scalars(statement).all()

    return list(budgets)

@router.get(
    "/{year}/{month}",
    response_model=BudgetRead,
)
def get_monthly_budget(
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> MonthlyBudget:
    statement = select(MonthlyBudget).where(
        MonthlyBudget.year == year,
        MonthlyBudget.month == month,
    )

    budget = db.scalar(statement)

    if budget is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Budget not found",
        )

    return budget


@router.put(
    "/{year}/{month}",
    response_model=BudgetRead,
)
def set_monthly_budget(
    budget_data: BudgetUpdate,
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> MonthlyBudget:
    statement = select(MonthlyBudget).where(
        MonthlyBudget.year == year,
        MonthlyBudget.month == month,
    )

    budget = db.scalar(statement)

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