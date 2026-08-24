from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.recurring import GenerateRecurringResult, RecurringPayload, RecurringRead
from app.services import recurring_service

router = APIRouter(prefix="/recurring", tags=["recurring"])


@router.get("", response_model=list[RecurringRead])
def list_recurring(db: Session = Depends(get_db)):
    return recurring_service.list_recurring(db)


@router.post("", response_model=RecurringRead, status_code=status.HTTP_201_CREATED)
def create_recurring(payload: RecurringPayload, db: Session = Depends(get_db)):
    return recurring_service.create_recurring(db, payload)


@router.put("/{recurring_id}", response_model=RecurringRead)
def update_recurring(recurring_id: int, payload: RecurringPayload, db: Session = Depends(get_db)):
    recurring = recurring_service.get_recurring(db, recurring_id)
    if recurring is None:
        raise HTTPException(status_code=404, detail="Récurrence introuvable")
    return recurring_service.update_recurring(db, recurring, payload)


@router.delete("/{recurring_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_recurring(recurring_id: int, db: Session = Depends(get_db)):
    recurring = recurring_service.get_recurring(db, recurring_id)
    if recurring is None:
        raise HTTPException(status_code=404, detail="Récurrence introuvable")
    recurring_service.delete_recurring(db, recurring)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/generate-due", response_model=GenerateRecurringResult)
def generate_due(db: Session = Depends(get_db)):
    return GenerateRecurringResult(generated=recurring_service.generate_due(db))
