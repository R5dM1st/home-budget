from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from app.models.account import Account
from app.models.transaction import Transaction
from app.schemas.account import AccountPayload, AccountRead


def _balance_expression():
    outgoing = func.coalesce(
        func.sum(
            case(
                (
                    Transaction.source_account_id == Account.id,
                    -Transaction.amount,
                ),
                else_=Decimal("0.00"),
            )
        ),
        Decimal("0.00"),
    )
    incoming = func.coalesce(
        func.sum(
            case(
                (
                    Transaction.destination_account_id == Account.id,
                    Transaction.amount,
                ),
                else_=Decimal("0.00"),
            )
        ),
        Decimal("0.00"),
    )
    return Account.opening_balance + outgoing + incoming


def list_accounts(db: Session, include_archived: bool = False) -> list[AccountRead]:
    balance = _balance_expression().label("balance")
    statement = (
        select(Account, balance)
        .outerjoin(
            Transaction,
            (Transaction.source_account_id == Account.id)
            | (Transaction.destination_account_id == Account.id),
        )
        .group_by(Account.id)
        .order_by(Account.is_archived.asc(), Account.created_at.asc())
    )
    if not include_archived:
        statement = statement.where(Account.is_archived.is_(False))

    rows = db.execute(statement).all()
    return [
        AccountRead(
            id=account.id,
            name=account.name,
            type=account.type,
            currency=account.currency,
            opening_balance=account.opening_balance,
            balance=balance_value,
            color=account.color,
            is_archived=account.is_archived,
            created_at=account.created_at,
        )
        for account, balance_value in rows
    ]


def get_account(db: Session, account_id: int) -> Account | None:
    return db.get(Account, account_id)


def create_account(db: Session, payload: AccountPayload) -> Account:
    account = Account(**payload.model_dump())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def update_account(db: Session, account: Account, payload: AccountPayload) -> Account:
    for key, value in payload.model_dump().items():
        setattr(account, key, value)
    db.commit()
    db.refresh(account)
    return account


def toggle_archive(db: Session, account: Account) -> Account:
    account.is_archived = not account.is_archived
    db.commit()
    db.refresh(account)
    return account
