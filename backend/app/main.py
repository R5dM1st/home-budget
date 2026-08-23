from fastapi import FastAPI


app = FastAPI(title="Home Budget API")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}