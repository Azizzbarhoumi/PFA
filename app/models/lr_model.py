import joblib
import os
from app.schemas.responses import ModelResult
from app.schemas.enums import Verdict
from app.core.logging import get_logger
from app.utils.timing import time_execution

logger = get_logger(__name__)

class LRInferenceEngine:
    def __init__(self, model_path: str, vectorizer_path: str):
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.model = None
        self.vectorizer = None

    def load(self):
        logger.info(f"Loading LR model from {self.model_path} and vectorizer from {self.vectorizer_path}...")
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                logger.info("LR model loaded successfully.")
            else:
                raise FileNotFoundError("Model or vectorizer file not found.")
        except Exception as e:
            logger.warning("Failed to load LR model, falling back to mock", error=str(e))
            self.model = None

    def predict(self, text: str) -> ModelResult:
        with time_execution() as timing:
            if not self.model or not self.vectorizer:
                logger.debug("LR mock prediction execution.")
                latency = timing.get("latency_ms", 10.0)
                return ModelResult(
                    model_name="Logistic Regression",
                    label=Verdict.REAL if "real" in text.lower() else Verdict.FAKE,
                    confidence=0.75,
                    latency_ms=latency
                )

            features = self.vectorizer.transform([text])
            prediction = self.model.predict(features)[0]
            probabilities = self.model.predict_proba(features)[0]
            
            # Flip: class 0 = FAKE, class 1 = REAL
            # Use prob of class 1 as confidence
            label = Verdict.REAL if prediction == 1 else Verdict.FAKE
            confidence = probabilities[1]

        return ModelResult(
            model_name="Logistic Regression",
            label=label,
            confidence=float(confidence),
            latency_ms=timing["latency_ms"]
        )

    def predict_word_heatmap(self, text: str) -> list:
        if not self.model or not self.vectorizer:
            # Mock behavior
            words = text.split()
            return [{"word": w, "score": 0.8 if i % 3 == 0 else 0.2} for i, w in enumerate(words)]
        
        words = text.split()
        heatmap = []
        
        for word in words:
            token = word.lower().strip('.,!?()[]"\'')
            score = 0.0
            if hasattr(self.vectorizer, 'vocabulary_') and token in self.vectorizer.vocabulary_:
                idx = self.vectorizer.vocabulary_[token]
                # Try to safely access coefficients
                if hasattr(self.model, 'coef_'):
                    coef = self.model.coef_[0][idx]
                    # Score > 0 implies leaning towards FAKE (assuming class 1 is fake)
                    # We pass the raw coefficient; the frontend can decide how to color it.
                    score = float(coef)
            heatmap.append({"word": word, "score": score})
            
        return heatmap
