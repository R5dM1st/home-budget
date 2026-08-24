from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.category import CategoryPayload, CategoryRead
from app.services import category_service

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
def list_categories(type: str | None = None, db: Session = Depends(get_db)):
    return category_service.list_categories(db, category_type=type)


@router.post("", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: CategoryPayload, db: Session = Depends(get_db)):
    try:
        return category_service.create_category(db, payload)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cette catégorie existe déjà")


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(category_id: int, payload: CategoryPayload, db: Session = Depends(get_db)):
    category = category_service.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    try:
        return category_service.update_category(db, category, payload)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Cette catégorie existe déjà")


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    category = category_service.get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=404, detail="Catégorie introuvable")
    category_service.delete_category(db, category)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
