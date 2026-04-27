from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl

from pathlib import Path

# Project Root
BASE_DIR = Path(__file__).parent.parent.parent


def _resolve_sequence_model_path() -> str:
    models_dir = BASE_DIR / "ml_models"
    prioritized = [
        models_dir / "cnn_lstm_fake_news_model.h5",
        models_dir / "cnn_lstm_fake_news_model.keras",
        models_dir / "cnn_fake_news_model.h5",
    ]
    existing_prioritized = [p for p in prioritized if p.exists()]
    if existing_prioritized:
        return str(existing_prioritized[0])

    discovered = sorted(models_dir.glob("*cnn*.h5")) + sorted(models_dir.glob("*cnn*.keras"))
    if discovered:
        return str(discovered[0])

    fallback = sorted(models_dir.glob("*.h5")) + sorted(models_dir.glob("*.keras"))
    if fallback:
        return str(fallback[0])

    return str(prioritized[0])

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None

    # Redis Cache
    REDIS_URL: Optional[str] = None

    # Paths to models (Absolute)
    BERT_MODEL_PATH: str = str(BASE_DIR / "ml_models" / "bert-base-uncased")
    CNN_MODEL_PATH: str = _resolve_sequence_model_path()
    CNN_MODEL_NAME: str = "CNN+LSTM"
    LR_MODEL_PATH: str = str(BASE_DIR / "ml_models" / "logistic_regression_welfake.pkl")
    SVM_MODEL_PATH: str = str(BASE_DIR / "ml_models" / "svm_linearsvc_welfake.pkl")
    VECTORIZER_PATH: str = str(BASE_DIR / "ml_models" / "tfidf_welfake.pkl")

    # Application settings
    PROJECT_NAME: str = "Fake News Detection API"
    VERSION: str = "1.0.0"
    LOG_LEVEL: str = "INFO"
    DEBUG: bool = False
    
    # Security
    CORS_ORIGINS: List[str] = ["*"]
    RATE_LIMIT_PER_MINUTE: int = 60

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

# Global settings instance
settings = Settings()
