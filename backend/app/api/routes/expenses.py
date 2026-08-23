from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseRead
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