from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.schemas.analytics import (
    CategorySpending,
    DailySpending,
    MonthlySummary,
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