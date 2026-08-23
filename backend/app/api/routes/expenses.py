from fastapi import APIRouter, Depends, status
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseRead, ExpenseUpdate

from sqlalchemy import select

router = APIRouter(
    prefix="/expenses",
    tags=["expenses"],
)


@router.post(
    "",
    response_model=ExpenseRead,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
) -> Expense:
    expense = Expense(
        date=expense_data.date,
        description=expense_data.description,
        amount=expense_data.amount,
        category=expense_data.category.value,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)

    return expense

@router.get(
    "",
    response_model=list[ExpenseRead],
)
def list_expenses(
    db: Session = Depends(get_db),
) -> list[Expense]:
    statement = select(Expense).order_by(
        Expense.date.desc(),
        Expense.id.desc(),
    )

    expenses = db.scalars(statement).all()

    return list(expenses)

@router.get(
    "/{expense_id}",
    response_model=ExpenseRead,
)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
) -> Expense:
    expense = db.get(Expense, expense_id)

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )

    return expense

@router.put(
    "/{expense_id}",
    response_model=ExpenseRead,
)
def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    db: Session = Depends(get_db),
) -> Expense:
    expense = db.get(Expense, expense_id)

    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Expense not found",
        )

    expense.date = expense_data.date
    expense.description = expense_data.description
    expense.amount = expense_data.amount
    expense.category = expense_data.category.value

    db.commit()
    db.refresh(expense)

    return expense