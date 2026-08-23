from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, Path, Query
from app.db.dependencies import get_db
from app.schemas.analytics import (
    CategorySpending,
    DailySpending,
    MonthlyComparison,
    MonthlySummary,
    TopExpense,
)
from app.services import analytics_service


router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
)
@router.get(
    "/{year}/{month}/categories",
    response_model=list[CategorySpending],
)
def get_spending_by_category(
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> list[CategorySpending]:
    return analytics_service.get_spending_by_category(
        db,
        year,
        month,
    )

@router.get(
    "/{year}/{month}/top-expenses",
    response_model=list[TopExpense],
)
def get_top_expenses(
    year: int,
    month: int = Path(ge=1, le=12),
    limit: int = Query(default=5, ge=1, le=20),
    db: Session = Depends(get_db),
) -> list[TopExpense]:
    return analytics_service.get_top_expenses(
        db,
        year,
        month,
        limit,
    )

@router.get(
    "/{year}/{month}/comparison",
    response_model=MonthlyComparison,
)
def get_monthly_comparison(
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> MonthlyComparison:
    return analytics_service.get_monthly_comparison(
        db,
        year,
        month,
    )

@router.get(
    "/{year}/{month}/daily",
    response_model=list[DailySpending],
)
def get_daily_spending(
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> list[DailySpending]:
    return analytics_service.get_daily_spending(
        db,
        year,
        month,
    )

@router.get(
    "/{year}/{month}/summary",
    response_model=MonthlySummary,
)
def get_monthly_summary(
    year: int,
    month: int = Path(ge=1, le=12),
    db: Session = Depends(get_db),
) -> MonthlySummary:
    return analytics_service.get_monthly_summary(
        db,
        year,
        month,
    )