from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.accounts import router as accounts_router
from app.api.routes.analytics import router as analytics_router
from app.api.routes.budgets import router as budgets_router
from app.api.routes.categories import router as categories_router
from app.api.routes.goals import router as goals_router
from app.api.routes.recurring import router as recurring_router
from app.api.routes.transactions import router as transactions_router
from app.core.config import settings
from app.db.session import SessionLocal, check_database_connection
from app.services.category_service import ensure_default_categories


@asynccontextmanager
async def lifespan(_: FastAPI):
    with SessionLocal() as db:
        ensure_default_categories(db)
    yield


app = FastAPI(
    title="Home Budget Finance API",
    version="2.0.0",
    description="Personal finance API: accounts, transactions, budgets, recurring operations and analytics.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

for router in (
    accounts_router,
    transactions_router,
    categories_router,
    budgets_router,
    analytics_router,
    recurring_router,
    goals_router,
):
    app.include_router(router, prefix="/api")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "version": "2.0.0"}


@app.get("/health/db")
def database_health_check() -> dict[str, str]:
    check_database_connection()
    return {"database": "ok"}
