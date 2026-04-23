from app.core.config import settings
from app.models.bert_model import BERTInferenceEngine
from app.models.lr_model import LRInferenceEngine
from app.models.svm_model import SVMInferenceEngine
from app.core.logging import get_logger

logger = get_logger(__name__)

class ModelManager:
    """
    Singleton manager to ensure models are loaded only once at application startup.
    """
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelManager, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized: return
        self.bert = BERTInferenceEngine(settings.BERT_MODEL_PATH)
        self.lr = LRInferenceEngine(settings.LR_MODEL_PATH, settings.VECTORIZER_PATH)
        self.svm = SVMInferenceEngine(settings.SVM_MODEL_PATH, settings.VECTORIZER_PATH)
        self._initialized = True

    def load_all(self):
        logger.info("Starting model loading sequence...")
        self.bert.load()
        self.lr.load()
        self.svm.load()
        logger.info("All models loaded (or mocked if artifacts absent).")

    def get_bert(self) -> BERTInferenceEngine:
        return self.bert

    def get_lr(self) -> LRInferenceEngine:
        return self.lr

    def get_svm(self) -> SVMInferenceEngine:
        return self.svm

model_manager = ModelManager()
