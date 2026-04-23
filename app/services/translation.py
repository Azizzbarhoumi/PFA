from typing import Tuple, Optional
from langdetect import detect, DetectorFactory
from groq import Groq
from app.core.config import settings
from app.core.logging import get_logger
import asyncio

logger = get_logger(__name__)

# Make langdetect deterministic
DetectorFactory.seed = 0

class TranslationService:
    def __init__(self):
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

    def process(self, text: str) -> Tuple[str, Optional[str], Optional[str]]:
        """
        Detects language. If not English, translates to English using Groq.
        Returns: (original_text, translated_text, detected_language_code)
        """
        try:
            lang = detect(text)
            
            if lang != 'en':
                logger.info("translating_text", source_lang=lang)
                if not self.groq_client:
                    logger.warning("Groq API key not configured, returning untranslated")
                    return text, None, lang
                    
                # Groq requires synchronous call, we should wrap it or just call it since this might be run in threadpool
                response = self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": "You are a professional translator. Translate the given text to English. Return ONLY the English translation, without any explanations, conversational filler, or markdown quotes."},
                        {"role": "user", "content": text}
                    ],
                    temperature=0.3
                )
                
                translated = response.choices[0].message.content.strip()
                return text, translated, lang
                
            return text, None, 'en'
            
        except Exception as e:
            logger.warning("translation_failed", error=str(e))
            return text, None, None
