from fastapi import APIRouter, Depends, Path, Query
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.analytics import AccountBalance, CategorySpending, DailyCashFlow, DashboardSummary, MonthlyPoint
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/{year}/{month}/summary", response_model=DashboardSummary)
def summary(year: int, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    return analytics_service.get_dashboard_summary(db, year, month)


@router.get("/{year}/{month}/categories", response_model=list[CategorySpending])
def categories(year: int, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    return analytics_service.get_category_spending(db, year, month)


@router.get("/{year}/{month}/daily", response_model=list[DailyCashFlow])
def daily(year: int, month: int = Path(ge=1, le=12), db: Session = Depends(get_db)):
    return analytics_service.get_daily_cash_flow(db, year, month)


@router.get("/accounts", response_model=list[AccountBalance])
def account_balances(db: Session = Depends(get_db)):
    return analytics_service.get_account_balances(db)


@router.get("/{year}/{month}/history", response_model=list[MonthlyPoint])
def history(
    year: int,
    month: int = Path(ge=1, le=12),
    months: int = Query(default=6, ge=2, le=24),
    db: Session = Depends(get_db),
):
    return analytics_service.get_monthly_history(db, year, month, months)
