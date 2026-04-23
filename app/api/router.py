from fastapi import APIRouter
from app.api.endpoints import analyze, paragraph, quiz, feed, report

api_router = APIRouter()

api_router.include_router(analyze.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(paragraph.router, prefix="/analyze", tags=["Analysis"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["Quiz"])
api_router.include_router(feed.router, prefix="/feed", tags=["Feed"])
api_router.include_router(report.router, prefix="/report", tags=["Report"])
