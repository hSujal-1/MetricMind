from fastapi import FastAPI

from app.config import APP_NAME, APP_VERSION
from app.routers.metrics import router as metrics_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION
)


@app.get("/")
def root():
    return {
        "message": "Welcome to MetricMind API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


app.include_router(metrics_router)