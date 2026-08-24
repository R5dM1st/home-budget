import datetime as dt

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.expense import Expense
from app.schemas.expense import ExpenseCreate, ExpenseUpdate


def _month_bounds(year: int, month: int) -> tuple[dt.date, dt.date]:
    start_date = dt.date(year, month, 1)

    if month == 12:
        end_date = dt.date(year + 1, 1, 1)
    else:
        end_date = dt.date(year, month + 1, 1)

    return start_date, end_date


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


def list_expenses(
    db: Session,
    year: int | None = None,
    month: int | None = None,
    category: str | None = None,
    search: str | None = None,
) -> list[Expense]:
    statement = select(Expense)

    if year is not None and month is not None:
        start_date, end_date = _month_bounds(year, month)
        statement = statement.where(
            Expense.date >= start_date,
            Expense.date < end_date,
        )

    if category:
        statement = statement.where(Expense.category == category)

    if search and search.strip():
        statement = statement.where(
            Expense.description.ilike(f"%{search.strip()}%")
        )

    statement = statement.order_by(
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
