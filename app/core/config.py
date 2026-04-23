from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    # API Keys
    GROQ_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None

    # Redis Cache
    REDIS_URL: Optional[str] = None

    # Paths to models
    BERT_MODEL_PATH: str = "bert-base-uncased"
    LR_MODEL_PATH: str = "ml_models/lr_model.pkl"
    SVM_MODEL_PATH: str = "ml_models/svm_model.pkl"
    VECTORIZER_PATH: str = "ml_models/tfidf_vectorizer.pkl"

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
