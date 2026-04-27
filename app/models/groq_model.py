import os
import json
import time
from groq import Groq
from app.schemas.responses import ModelResult
from app.schemas.enums import Verdict
from app.core.logging import get_logger
from app.utils.timing import time_execution

logger = get_logger(__name__)

class GroqInferenceEngine:
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.client = None
        # Using a reliable model from Groq
        self.model_name = "llama-3.3-70b-versatile"

    def load(self):
        if not self.api_key:
            logger.warning("GROQ_API_KEY not found in environment. Groq model will be disabled.")
            return
        try:
            self.client = Groq(api_key=self.api_key)
            logger.info("Groq client initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Groq client: {e}")

    def predict(self, text: str) -> ModelResult:
        with time_execution() as timing:
            if not self.client:
                logger.debug("Groq mock prediction - no client initialized")
                return ModelResult(
                    model_name="Groq LLM",
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=timing.get("latency_ms", 0.0)
                )

            try:
                # System prompt to force binary classification and JSON output
                system_prompt = (
                    "You are a highly accurate news fact-checking assistant. "
                    "Analyze the text and determine if it is likely to be FAKE news or REAL news. "
                    "You must output ONLY valid JSON."
                )
                
                user_prompt = (
                    f"Analyze this news content and provide a verdict (FAKE or REAL) and a confidence score (0.0 to 1.0).\n\n"
                    f"Content: {text[:3000]}\n\n"
                    "Response Format:\n"
                    "{\"verdict\": \"FAKE\" or \"REAL\", \"confidence\": 0.95}"
                )

                chat_completion = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    model=self.model_name,
                    response_format={"type": "json_object"},
                    temperature=0.1, # Low temperature for consistency
                    max_tokens=100
                )

                response_content = chat_completion.choices[0].message.content
                data = json.loads(response_content)
                
                verdict_str = data.get("verdict", "REAL").upper()
                label = Verdict.FAKE if "FAKE" in verdict_str else Verdict.REAL
                confidence = float(data.get("confidence", 0.7))
                
                # Clip confidence
                confidence = max(0.0, min(1.0, confidence))
                
            except Exception as e:
                logger.warning(f"Groq prediction failed: {e}")
                return ModelResult(
                    model_name="Groq LLM",
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=timing.get("latency_ms", 0.0)
                )

        return ModelResult(
            model_name="Groq LLM",
            label=label,
            confidence=confidence,
            latency_ms=timing["latency_ms"]
        )
