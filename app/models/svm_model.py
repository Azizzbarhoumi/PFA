import joblib
import os
from app.schemas.responses import ModelResult
from app.schemas.enums import Verdict
from app.core.logging import get_logger
from app.utils.timing import time_execution

logger = get_logger(__name__)

class SVMInferenceEngine:
    def __init__(self, model_path: str, vectorizer_path: str):
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.model = None
        self.vectorizer = None

    def load(self):
        print(f"[loader] Looking for SVM model at: {self.model_path}")
        print(f"[loader] File exists: {os.path.exists(self.model_path)}")
        
        logger.info(f"Loading SVM model from {self.model_path}...")
        try:
            if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
                self.model = joblib.load(self.model_path)
                self.vectorizer = joblib.load(self.vectorizer_path)
                logger.info("SVM model loaded successfully.")
            else:
                logger.error(f"SVM Model files not found: {self.model_path}, {self.vectorizer_path}")
                self.model = None
                self.vectorizer = None
        except Exception as e:
            logger.error("Failed to load SVM model", error=str(e))
            self.model = None
            self.vectorizer = None

    def predict(self, text: str) -> ModelResult:
        with time_execution() as timing:
            if not self.model or not self.vectorizer:
                logger.debug("SVM mock prediction execution.")
                latency = timing.get("latency_ms", 15.0)
                return ModelResult(
                    model_name="SVM",
                    label=Verdict.FAKE if "svm fake" in text.lower() else Verdict.REAL,
                    confidence=0.72,
                    latency_ms=latency
                )

            features = self.vectorizer.transform([text])
            prediction = self.model.predict(features)[0]
            
            try:
                probabilities = self.model.predict_proba(features)[0]
                confidence = probabilities[prediction]
            except AttributeError:
                confidence = 0.8
            
            # Swap: class 1 = FAKE, class 0 = REAL
            label = Verdict.FAKE if prediction == 1 else Verdict.REAL

        return ModelResult(
            model_name="SVM",
            label=label,
            confidence=float(confidence),
            latency_ms=timing["latency_ms"]
        )