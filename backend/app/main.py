from fastapi import FastAPI

from app.db.session import check_database_connection


app = FastAPI(title="Home Budget API")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/db")
def database_health_check() -> dict[str, str]:
    check_database_connection()
    return {"database": "ok"}