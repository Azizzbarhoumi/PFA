from fastapi import APIRouter, Depends
from app.schemas.responses import QuizResponse
from app.api.dependencies import get_quiz_service
from app.services.quiz import QuizService

router = APIRouter()

@router.get("", response_model=QuizResponse)
async def generate_quiz(quiz_service: QuizService = Depends(get_quiz_service)):
    # Quiz is dynamic, so no caching by default or cache for 1 hour to prevent API spam
    return await quiz_service.generate()
