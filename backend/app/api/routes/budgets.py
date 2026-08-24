from fastapi import APIRouter, Depends, HTTPException, Path, Response, status
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.budget import BudgetLimitRead, BudgetLimitUpdate, BudgetRead, BudgetUpdate
from app.services import budget_service, category_service

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.get("", response_model=list[BudgetRead])
def list_budgets(db: Session = Depends(get_db)):
    return budget_service.list_budgets(db)


@router.get("/{year}/{month}", response_model=BudgetRead)
def get_budget(year: int, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    budget = budget_service.get_budget(db, year, month)
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget introuvable")
    return budget


@router.put("/{year}/{month}", response_model=BudgetRead)
def set_budget(year: int, payload: BudgetUpdate, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    return budget_service.set_budget(db, year, month, payload)


@router.get("/{year}/{month}/limits", response_model=list[BudgetLimitRead])
def list_limits(year: int, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    return budget_service.list_limits(db, year, month)


@router.put("/{year}/{month}/limits/{category_id}", response_model=BudgetLimitRead)
def set_limit(
    year: int,
    category_id: int,
    payload: BudgetLimitUpdate,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
):
    category = category_service.get_category(db, category_id)
    if category is None or category.type != "expense":
        raise HTTPException(status_code=422, detail="Catégorie de dépense introuvable")
    budget_service.set_limit(db, year, month, category_id, payload)
    return next(item for item in budget_service.list_limits(db, year, month) if item.category_id == category_id)


@router.delete("/{year}/{month}/limits/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_limit(
    year: int,
    category_id: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
):
    if not budget_service.delete_limit(db, year, month, category_id):
        raise HTTPException(status_code=404, detail="Limite introuvable")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
