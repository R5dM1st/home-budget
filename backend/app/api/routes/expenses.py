from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.expense import Expense
from app.schemas.expense import (
    ExpenseCategory,
    ExpenseCreate,
    ExpenseRead,
    ExpenseUpdate,
)
from app.services import expense_service


router = APIRouter(
    prefix="/expenses",
    tags=["expenses"],
)


def get_expense_or_404(
    expense_id: int,
    db: Session,
) -> Expense:
    expense = expense_service.get_expense(db, expense_id)

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )

    return expense


@router.post(
    "",
    response_model=ExpenseRead,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
) -> Expense:
    return expense_service.create_expense(db, expense_data)


@router.get(
    "",
    response_model=list[ExpenseRead],
)
def list_expenses(
    year: int | None = Query(default=None, ge=2000, le=2100),
    month: int | None = Query(default=None, ge=1, le=12),
    category: ExpenseCategory | None = None,
    search: str | None = Query(default=None, max_length=255),
    db: Session = Depends(get_db),
) -> list[Expense]:
    return expense_service.list_expenses(
        db,
        year=year,
        month=month,
        category=category.value if category else None,
        search=search,
    )


@router.get("/{expense_id}", response_model=ExpenseRead)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
) -> Expense:
    return get_expense_or_404(expense_id, db)


@router.put("/{expense_id}", response_model=ExpenseRead)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
) -> Expense:
    expense = get_expense_or_404(expense_id, db)
    return expense_service.update_expense(db, expense, expense_data)


@router.delete(
    "/{expense_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
) -> None:
    expense = get_expense_or_404(expense_id, db)
    expense_service.delete_expense(db, expense)
