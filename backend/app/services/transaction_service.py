import datetime as dt

from fastapi import HTTPException
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, aliased

from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionPayload, TransactionRead


def validate_references(db: Session, payload: TransactionPayload) -> None:
    account_ids = {
        value
        for value in (payload.source_account_id, payload.destination_account_id)
        if value is not None
    }
    if account_ids:
        found = set(db.scalars(select(Account.id).where(Account.id.in_(account_ids))).all())
        if found != account_ids:
            raise HTTPException(status_code=422, detail="Compte introuvable")

    if payload.category_id is not None:
        category = db.get(Category, payload.category_id)
        if category is None:
            raise HTTPException(status_code=422, detail="Catégorie introuvable")
        if payload.type in {"expense", "income"} and category.type != payload.type:
            raise HTTPException(
                status_code=422,
                detail="La catégorie ne correspond pas au type de transaction",
            )
        if payload.type == "transfer":
            raise HTTPException(status_code=422, detail="Un transfert ne doit pas avoir de catégorie")


def create_transaction(db: Session, payload: TransactionPayload) -> Transaction:
    validate_references(db, payload)
    transaction = Transaction(**payload.model_dump())
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_transaction(db: Session, transaction_id: int) -> Transaction | None:
    return db.get(Transaction, transaction_id)


def update_transaction(
    db: Session, transaction: Transaction, payload: TransactionPayload
) -> Transaction:
    validate_references(db, payload)
    for key, value in payload.model_dump().items():
        setattr(transaction, key, value)
    db.commit()
    db.refresh(transaction)
    return transaction


def delete_transaction(db: Session, transaction: Transaction) -> None:
    db.delete(transaction)
    db.commit()


def list_transactions(
    db: Session,
    year: int | None = None,
    month: int | None = None,
    transaction_type: str | None = None,
    account_id: int | None = None,
    category_id: int | None = None,
    search: str | None = None,
    limit: int = 300,
) -> list[TransactionRead]:
    source = aliased(Account)
    destination = aliased(Account)

    statement = (
        select(
            Transaction,
            source.name.label("source_name"),
            destination.name.label("destination_name"),
            Category.name.label("category_name"),
            Category.color.label("category_color"),
        )
        .outerjoin(source, Transaction.source_account_id == source.id)
        .outerjoin(destination, Transaction.destination_account_id == destination.id)
        .outerjoin(Category, Transaction.category_id == Category.id)
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .limit(limit)
    )

    if year is not None:
        statement = statement.where(
            Transaction.date >= dt.date(year, month or 1, 1) if month else Transaction.date >= dt.date(year, 1, 1)
        )
        if month:
            end = dt.date(year + 1, 1, 1) if month == 12 else dt.date(year, month + 1, 1)
            statement = statement.where(Transaction.date < end)
        else:
            statement = statement.where(Transaction.date < dt.date(year + 1, 1, 1))
    if transaction_type:
        statement = statement.where(Transaction.type == transaction_type)
    if account_id:
        statement = statement.where(
            or_(
                Transaction.source_account_id == account_id,
                Transaction.destination_account_id == account_id,
            )
        )
    if category_id:
        statement = statement.where(Transaction.category_id == category_id)
    if search:
        statement = statement.where(Transaction.description.ilike(f"%{search.strip()}%"))

    rows = db.execute(statement).all()
    return [
        TransactionRead(
            id=transaction.id,
            date=transaction.date,
            description=transaction.description,
            type=transaction.type,
            amount=transaction.amount,
            source_account_id=transaction.source_account_id,
            source_account_name=source_name,
            destination_account_id=transaction.destination_account_id,
            destination_account_name=destination_name,
            category_id=transaction.category_id,
            category_name=category_name,
            category_color=category_color,
            notes=transaction.notes,
            created_at=transaction.created_at,
            updated_at=transaction.updated_at,
        )
        for transaction, source_name, destination_name, category_name, category_color in rows
    ]
