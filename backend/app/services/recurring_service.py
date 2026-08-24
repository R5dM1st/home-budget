import calendar
import datetime as dt

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.recurring_transaction import RecurringTransaction
from app.models.transaction import Transaction
from app.schemas.recurring import RecurringPayload


def list_recurring(db: Session) -> list[RecurringTransaction]:
    return list(db.scalars(select(RecurringTransaction).order_by(RecurringTransaction.next_date.asc())).all())


def get_recurring(db: Session, recurring_id: int) -> RecurringTransaction | None:
    return db.get(RecurringTransaction, recurring_id)


def create_recurring(db: Session, payload: RecurringPayload) -> RecurringTransaction:
    recurring = RecurringTransaction(**payload.model_dump())
    db.add(recurring)
    db.commit()
    db.refresh(recurring)
    return recurring


def update_recurring(db: Session, recurring: RecurringTransaction, payload: RecurringPayload) -> RecurringTransaction:
    for key, value in payload.model_dump().items():
        setattr(recurring, key, value)
    db.commit()
    db.refresh(recurring)
    return recurring


def delete_recurring(db: Session, recurring: RecurringTransaction) -> None:
    db.delete(recurring)
    db.commit()


def advance_date(value: dt.date, frequency: str) -> dt.date:
    if frequency == "weekly":
        return value + dt.timedelta(days=7)
    if frequency == "yearly":
        day = min(value.day, calendar.monthrange(value.year + 1, value.month)[1])
        return dt.date(value.year + 1, value.month, day)
    next_year = value.year + (1 if value.month == 12 else 0)
    next_month = 1 if value.month == 12 else value.month + 1
    day = min(value.day, calendar.monthrange(next_year, next_month)[1])
    return dt.date(next_year, next_month, day)


def generate_due(db: Session, today: dt.date | None = None) -> int:
    today = today or dt.date.today()
    recurring_items = list(
        db.scalars(
            select(RecurringTransaction).where(
                RecurringTransaction.is_active.is_(True),
                RecurringTransaction.next_date <= today,
            )
        ).all()
    )
    generated = 0
    for item in recurring_items:
        while item.next_date <= today:
            db.add(
                Transaction(
                    date=item.next_date,
                    description=item.description,
                    type=item.type,
                    amount=item.amount,
                    source_account_id=item.source_account_id,
                    destination_account_id=item.destination_account_id,
                    category_id=item.category_id,
                    notes=item.notes,
                )
            )
            item.next_date = advance_date(item.next_date, item.frequency)
            generated += 1
    db.commit()
    return generated
