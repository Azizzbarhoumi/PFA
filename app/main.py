from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.logging import setup_logging, get_logger
from app.core.middleware import GlobalExceptionMiddleware, TimingMiddleware
from app.api.router import api_router
from app.models.manager import model_manager

# Setup structured logging
setup_logging()
logger = get_logger(__name__)

# Rate limiter setup
limiter = Limiter(key_func=get_remote_address, default_limits=[f"{settings.RATE_LIMIT_PER_MINUTE}/minute"])

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting up Fake News Detection System...")
    logger.info("Initializing models globally...")
    model_manager.load_all()
    # Initialize thread pool for models here if needed, or rely on global in analysis.py
    yield
    # Shutdown
    logger.info("Shutting down Fake News Detection System...")
    # cleanup resources here if necessary (e.g. redis connections, thread pools)
    from app.services.analysis import thread_pool
    thread_pool.shutdown(wait=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Scalable model inference API for identifying fake news and assessing media reliability.",
    lifespan=lifespan
)

# Set rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middleware (Order is important! First added is innermost)
app.add_middleware(SlowAPIMiddleware) # Uses app.state.limiter implicitly
app.add_middleware(TimingMiddleware)
app.add_middleware(GlobalExceptionMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "up",
        "models_loaded": {
            "bert": model_manager.get_bert().model is not None,
            "lr": model_manager.get_lr().model is not None,
            "svm": model_manager.get_svm().model is not None
        }
    }
