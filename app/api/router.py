from fastapi import APIRouter
from app.api.endpoints import analyze, paragraph, quiz, feed, report

api_router = APIRouter()

@api_router.get("/health", tags=["Health"])
async def health_check_v1():
    from app.models.manager import model_manager
    loader = model_manager
    return {
        "bert": "loaded" if loader.get_bert().model is not None else "not found",
        "cnn": "loaded" if loader.get_cnn().model is not None else "not found",
        "lr": "loaded" if loader.get_lr().model is not None else "not found",
        "svm": "loaded" if loader.get_svm().model is not None else "not found",
        "tfidf": "loaded" if (loader.get_lr().vectorizer is not None or loader.get_svm().vectorizer is not None) else "not found"
    }

api_router.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(paragraph.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
api_router.include_router(feed.router, prefix="/feed", tags=["Feed"])
api_router.include_router(report.router, prefix="/report", tags=["Report"])
