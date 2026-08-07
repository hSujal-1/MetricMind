from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import APP_NAME, APP_VERSION
from app.services.metadata_cache import load_metadata
from app.routers.metrics import router as metrics_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION
)
# Load semantic metadata once
load_metadata()

# ----------------------------------
# CORS Configuration
# ----------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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