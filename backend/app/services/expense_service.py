from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def create_expense(
    db: Session,
    expense_data: ExpenseCreate,
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


def list_expenses(db: Session) -> list[Expense]:
    statement = select(Expense).order_by(
        Expense.date.desc(),
        Expense.id.desc(),
    )

    return list(db.scalars(statement).all())


def get_expense(
    db: Session,
    expense_id: int,
) -> Expense | None:
    return db.get(Expense, expense_id)


def update_expense(
    db: Session,
    expense: Expense,
    expense_data: ExpenseUpdate,
) -> Expense:
    expense.date = expense_data.date
    expense.description = expense_data.description
    expense.amount = expense_data.amount
    expense.category = expense_data.category.value

    db.commit()
    db.refresh(expense)

    return expense


def delete_expense(
    db: Session,
    expense: Expense,
) -> None:
    db.delete(expense)
    db.commit()