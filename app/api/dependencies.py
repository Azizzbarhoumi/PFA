from typing import Generator
from fastapi import Depends
from app.models.manager import model_manager, ModelManager
from app.services.analysis import AnalysisService
from app.services.input_handlers import InputHandlerService
from app.services.paragraph_analysis import ParagraphAnalysisService
from app.services.quiz import QuizService
from app.services.feed import FeedService
from app.services.report import ReportService
from app.services.cache import CacheService

# Cache instance
_cache_service = CacheService()

def get_model_manager() -> ModelManager:
    return model_manager

def get_analysis_service(manager: ModelManager = Depends(get_model_manager)) -> AnalysisService:
    return AnalysisService(manager)

def get_input_handler_service() -> InputHandlerService:
    return InputHandlerService()

def get_paragraph_analysis_service(analysis_service: AnalysisService = Depends(get_analysis_service)) -> ParagraphAnalysisService:
    return ParagraphAnalysisService(analysis_service)

def get_quiz_service() -> QuizService:
    return QuizService()

def get_feed_service(manager: ModelManager = Depends(get_model_manager)) -> FeedService:
    return FeedService(manager)

def get_report_service() -> ReportService:
    return ReportService()

def get_cache_service() -> CacheService:
    return _cache_service
