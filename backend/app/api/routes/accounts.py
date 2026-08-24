from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.account import AccountPayload, AccountRead
from app.services import account_service

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("", response_model=list[AccountRead])
def list_accounts(include_archived: bool = False, db: Session = Depends(get_db)):
    return account_service.list_accounts(db, include_archived=include_archived)


@router.post("", response_model=AccountRead, status_code=status.HTTP_201_CREATED)
def create_account(payload: AccountPayload, db: Session = Depends(get_db)):
    account = account_service.create_account(db, payload)
    return next(item for item in account_service.list_accounts(db, include_archived=True) if item.id == account.id)


@router.put("/{account_id}", response_model=AccountRead)
def update_account(account_id: int, payload: AccountPayload, db: Session = Depends(get_db)):
    account = account_service.get_account(db, account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="Compte introuvable")
    account_service.update_account(db, account, payload)
    return next(item for item in account_service.list_accounts(db, include_archived=True) if item.id == account.id)


@router.patch("/{account_id}/archive", response_model=AccountRead)
def toggle_archive(account_id: int, db: Session = Depends(get_db)):
    account = account_service.get_account(db, account_id)
    if account is None:
        raise HTTPException(status_code=404, detail="Compte introuvable")
    account_service.toggle_archive(db, account)
    return next(item for item in account_service.list_accounts(db, include_archived=True) if item.id == account.id)
