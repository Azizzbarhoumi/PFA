import json
import uuid
from fastapi import HTTPException
from groq import Groq
from app.core.config import settings
from app.schemas.responses import QuizResponse, QuizQuestion
from app.core.logging import get_logger

logger = get_logger(__name__)

class QuizService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    async def generate(self) -> QuizResponse:
        if not self.groq_client:
            raise HTTPException(status_code=503, detail="Groq API key not configured")
            
        logger.info("generating_quiz")
        
        prompt = """
        Generate a fake news detection quiz. Return EXACTLY a JSON object with a key "questions" containing an array of 5 objects.
        Each object must have:
        1. "headline": A realistic news headline (mix of obvious fake, subtle fake, and real).
        2. "is_fake": boolean (true if fake, false if real)
        3. "explanation": 1-2 sentences explaining why it's fake or real, focusing on media literacy.
        
        Provide roughly 3 fake and 2 real headlines. ONLY return the JSON object, no markdown blocks.
        """
        
        try:
            import asyncio
            loop = asyncio.get_running_loop()
            
            def _call_groq():
                return self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.7,
                    response_format={"type": "json_object"}
                )
                
            response = await loop.run_in_executor(None, _call_groq)
            content = response.choices[0].message.content
            
            content = content.replace("```json", "").replace("```", "").strip()
            
            data = json.loads(content)
            
            items = data.get("questions", [])
            if not items:
                items = list(data.values())[0] if data else []
                
            questions = []
            for item in items[:5]:
                questions.append(QuizQuestion(
                    headline=item.get("headline", ""),
                    is_fake=item.get("is_fake", False),
                    explanation=item.get("explanation", "")
                ))
            
            first = questions[0] if questions else QuizQuestion(headline="", is_fake=False, explanation="")
                
            return QuizResponse(
                session_id=str(uuid.uuid4()),
                category="general",
                article_title=first.headline,
                article_text=first.explanation,
                source="News Database",
                model_analysis={"verdict": "FAKE" if first.is_fake else "REAL", "confidence": 0.8},
                questions=questions
            )
            
        except Exception as e:
            logger.error("quiz_generation_failed", error=str(e))
            raise HTTPException(status_code=500, detail=f"Failed to generate quiz: {str(e)}")
