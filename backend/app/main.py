from fastapi import FastAPI

from app.api.routes.budgets import router as budgets_router
from app.api.routes.expenses import router as expenses_router
from app.db.session import check_database_connection
from app.api.routes.analytics import router as analytics_router

app = FastAPI(title="Home Budget API")

app.include_router(
    expenses_router,
    prefix="/api",
)

app.include_router(
    budgets_router,
    prefix="/api",
)

app.include_router(
    analytics_router,
    prefix="/api",
)

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db")
def database_health_check() -> dict[str, str]:
    check_database_connection()
    return {"database": "ok"}

