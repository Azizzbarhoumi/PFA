import os
from typing import Optional

import numpy as np

from app.core.logging import get_logger
from app.schemas.enums import Verdict
from app.schemas.responses import ModelResult
from app.utils.timing import time_execution

logger = get_logger(__name__)


class CNNInferenceEngine:
    def __init__(self, model_path: str, vectorizer_path: str, model_name: str = "CNN+LSTM"):
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self.model_name = model_name
        self.model = None
        self.vectorizer = None
        self._tf = None

    def load(self):
        logger.info(f"Loading {self.model_name} model from {self.model_path}...")
        try:
            if not os.path.exists(self.model_path):
                logger.error(f"{self.model_name} model file not found: {self.model_path}")
                self.model = None
                self.vectorizer = None
                return

            if not os.path.exists(self.vectorizer_path):
                logger.error(f"{self.model_name} vectorizer file not found: {self.vectorizer_path}")
                self.model = None
                self.vectorizer = None
                return

            import joblib
            import tensorflow as tf

            self._tf = tf
            self.model = tf.keras.models.load_model(self.model_path)
            self.vectorizer = joblib.load(self.vectorizer_path)
            logger.info(f"{self.model_name} model loaded successfully.")
        except Exception as e:
            logger.error(f"Failed to load {self.model_name} model", error=str(e))
            self.model = None
            self.vectorizer = None

    def _prepare_features(self, text: str) -> Optional[np.ndarray]:
        if self.vectorizer is None:
            return None

        features = self.vectorizer.transform([text]).toarray().astype("float32")
        expected_shape = getattr(self.model, "input_shape", None)

        # Adapt to common Keras input formats without hardcoded assumptions.
        if isinstance(expected_shape, tuple) and len(expected_shape) == 3:
            # e.g. (None, timesteps, channels) -> add channel dimension
            if expected_shape[-1] == 1:
                return np.expand_dims(features, axis=-1)

        return features

    def predict(self, text: str) -> ModelResult:
        with time_execution() as timing:
            if self.model is None or self.vectorizer is None:
                latency = timing.get("latency_ms", 12.0)
                return ModelResult(
                    model_name=self.model_name,
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=latency,
                )

            try:
                inputs = self._prepare_features(text)
                if inputs is None:
                    raise ValueError(f"{self.model_name} input preparation failed")

                raw_pred = self.model.predict(inputs, verbose=0)
                score = float(np.array(raw_pred).reshape(-1)[0])
                score = max(0.0, min(1.0, score))
                label = Verdict.FAKE if score >= 0.5 else Verdict.REAL
                confidence = score if label == Verdict.FAKE else (1.0 - score)
            except Exception as e:
                logger.warning(f"{self.model_name} prediction failed: {e}")
                return ModelResult(
                    model_name=self.model_name,
                    label=Verdict.REAL,
                    confidence=0.5,
                    latency_ms=timing.get("latency_ms", 12.0),
                )

        return ModelResult(
            model_name=self.model_name,
            label=label,
            confidence=confidence,
            latency_ms=timing["latency_ms"],
        )
