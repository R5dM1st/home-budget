from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.transaction import TransactionPayload, TransactionRead
from app.services import transaction_service

router = APIRouter(prefix="/transactions", tags=["transactions"])


@router.get("", response_model=list[TransactionRead])
def list_transactions(
    year: int | None = None,
    month: int | None = Query(default=None, ge=1, le=12),
    type: str | None = None,
    account_id: int | None = None,
    category_id: int | None = None,
    search: str | None = None,
    limit: int = Query(default=300, ge=1, le=1000),
    db: Session = Depends(get_db),
):
    return transaction_service.list_transactions(
        db,
        year=year,
        month=month,
        transaction_type=type,
        account_id=account_id,
        category_id=category_id,
        search=search,
        limit=limit,
    )


@router.post("", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
def create_transaction(payload: TransactionPayload, db: Session = Depends(get_db)):
    transaction = transaction_service.create_transaction(db, payload)
    return next(item for item in transaction_service.list_transactions(db, limit=1000) if item.id == transaction.id)


@router.get("/{transaction_id}", response_model=TransactionRead)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    items = transaction_service.list_transactions(db, limit=1000)
    transaction = next((item for item in items if item.id == transaction_id), None)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    return transaction


@router.put("/{transaction_id}", response_model=TransactionRead)
def update_transaction(transaction_id: int, payload: TransactionPayload, db: Session = Depends(get_db)):
    transaction = transaction_service.get_transaction(db, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    transaction_service.update_transaction(db, transaction, payload)
    return next(item for item in transaction_service.list_transactions(db, limit=1000) if item.id == transaction.id)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = transaction_service.get_transaction(db, transaction_id)
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction introuvable")
    transaction_service.delete_transaction(db, transaction)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
